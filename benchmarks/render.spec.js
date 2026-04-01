const fs = require('node:fs');
const path = require('node:path');

const { test, expect } = require('@playwright/test');

const { buildBenchmarkUrl, renderScenarios } = require('./scenarios');

const RESULTS_DIR = path.resolve(__dirname, 'results', 'raw');
const FRAME_BUDGET_MS = 1000 / 60;

function sanitizeName(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-');
}

function metricsToObject(metrics) {
  return Object.fromEntries(metrics.map((metric) => [metric.name, metric.value]));
}

function percentile(values, ratio) {
  if (!values.length) {
    return null;
  }

  const sorted = [...values].sort((left, right) => left - right);
  const index = Math.min(sorted.length - 1, Math.max(0, Math.ceil(sorted.length * ratio) - 1));

  return sorted[index];
}

function summarizeRuntimeProbe(runtimeProbe) {
  const frameDeltas = Array.isArray(runtimeProbe?.frameDeltas)
    ? runtimeProbe.frameDeltas.filter((value) => Number.isFinite(value) && value > 0)
    : [];
  const longTasks = Array.isArray(runtimeProbe?.longTasks)
    ? runtimeProbe.longTasks.filter((entry) => Number.isFinite(entry?.duration))
    : [];

  const averageFrameDeltaMs = frameDeltas.length
    ? frameDeltas.reduce((sum, value) => sum + value, 0) / frameDeltas.length
    : null;
  const approximateFps = averageFrameDeltaMs ? 1000 / averageFrameDeltaMs : null;
  const droppedFrameCount = frameDeltas.filter((value) => value > FRAME_BUDGET_MS).length;
  const droppedFrameRatio = frameDeltas.length ? droppedFrameCount / frameDeltas.length : null;
  const totalBlockingTimeMs = longTasks.reduce(
    (sum, entry) => sum + Math.max(0, entry.duration - 50),
    0,
  );

  return {
    frameSampleCount: frameDeltas.length,
    averageFrameDeltaMs,
    p95FrameDeltaMs: percentile(frameDeltas, 0.95),
    worstFrameDeltaMs: frameDeltas.length ? Math.max(...frameDeltas) : null,
    approximateFps,
    droppedFrameCount,
    droppedFrameRatio,
    longTaskCount: longTasks.length,
    longestLongTaskMs: longTasks.length
      ? Math.max(...longTasks.map((entry) => entry.duration))
      : null,
    totalBlockingTimeMs,
  };
}

async function installRuntimeProbe(page) {
  await page.addInitScript(() => {
    const runtimeProbe = {
      frameDeltas: [],
      longTasks: [],
      running: true,
    };

    let lastFrameTimestamp = null;
    let frameHandle = 0;
    let longTaskObserver = null;

    const frameLoop = (timestamp) => {
      if (!runtimeProbe.running) {
        return;
      }

      if (lastFrameTimestamp !== null) {
        runtimeProbe.frameDeltas.push(timestamp - lastFrameTimestamp);
      }

      lastFrameTimestamp = timestamp;
      frameHandle = window.requestAnimationFrame(frameLoop);
    };

    frameHandle = window.requestAnimationFrame(frameLoop);

    if (typeof window.PerformanceObserver === 'function') {
      try {
        longTaskObserver = new window.PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            runtimeProbe.longTasks.push({
              startTime: entry.startTime,
              duration: entry.duration,
            });
          }
        });

        longTaskObserver.observe({ type: 'longtask', buffered: true });
      } catch {
        longTaskObserver = null;
      }
    }

    runtimeProbe.stop = () => {
      runtimeProbe.running = false;
      window.cancelAnimationFrame(frameHandle);

      if (longTaskObserver) {
        longTaskObserver.disconnect();
      }
    };

    window.__SORTIFY_RUNTIME_PROBE__ = runtimeProbe;
  });
}

async function waitForBenchmarkReady(page) {
  await page.waitForFunction(() => {
    const state = window.__SORTIFY_BENCHMARK__;
    return Boolean(state && state.ready === true);
  });
}

async function waitForBenchmarkCompletion(page, timeoutMs) {
  await page.waitForFunction(() => {
    const state = window.__SORTIFY_BENCHMARK__;
    return Boolean(state && state.completed === true);
  }, null, { timeout: timeoutMs });
}

async function readBenchmarkSnapshot(page) {
  return page.evaluate(() => window.__SORTIFY_BENCHMARK__);
}

async function readRuntimeProbe(page) {
  return page.evaluate(() => {
    const runtimeProbe = window.__SORTIFY_RUNTIME_PROBE__;

    runtimeProbe?.stop?.();

    return {
      frameDeltas: Array.isArray(runtimeProbe?.frameDeltas) ? [...runtimeProbe.frameDeltas] : [],
      longTasks: Array.isArray(runtimeProbe?.longTasks) ? [...runtimeProbe.longTasks] : [],
    };
  });
}

for (const scenario of renderScenarios) {
  test(`${scenario.name}`, async ({ page, baseURL }, testInfo) => {
    test.setTimeout(scenario.timeoutMs + 30_000);

    if (!baseURL) {
      test.fail(true, 'Missing baseURL for benchmark project.');
      return;
    }

    fs.mkdirSync(RESULTS_DIR, { recursive: true });

    const url = buildBenchmarkUrl(baseURL, scenario);
    const cdpSession = await page.context().newCDPSession(page);

    await installRuntimeProbe(page);
    await cdpSession.send('Performance.enable');

    const startedAt = Date.now();

    await page.goto(url, { waitUntil: 'networkidle' });
    await waitForBenchmarkReady(page);

    const initialSnapshot = await readBenchmarkSnapshot(page);

    if (scenario.autoplay !== false) {
      await waitForBenchmarkCompletion(page, scenario.timeoutMs);
    }

    const finishedAt = Date.now();
    const finalSnapshot = await readBenchmarkSnapshot(page);
    const runtimeProbe = await readRuntimeProbe(page);
    const performanceMetrics = await cdpSession.send('Performance.getMetrics');
    const result = {
      framework: testInfo.project.name,
      scenario,
      url,
      startedAt: new Date(startedAt).toISOString(),
      finishedAt: new Date(finishedAt).toISOString(),
      runtimeMs: finishedAt - startedAt,
      initialSnapshot,
      finalSnapshot,
      runtimeProbe,
      runtimeQuality: summarizeRuntimeProbe(runtimeProbe),
      performanceMetrics: metricsToObject(performanceMetrics.metrics),
    };

    const resultFileName = `${sanitizeName(testInfo.project.name)}-${sanitizeName(scenario.name)}.json`;
    const resultPath = path.join(RESULTS_DIR, resultFileName);

    fs.writeFileSync(resultPath, JSON.stringify(result, null, 2));

    await testInfo.attach('benchmark-result', {
      path: resultPath,
      contentType: 'application/json',
    });

    expect(finalSnapshot).toBeTruthy();
    expect(finalSnapshot.ready).toBe(true);

    if (scenario.autoplay !== false) {
      expect(finalSnapshot.completed).toBe(true);
    }
  });
}