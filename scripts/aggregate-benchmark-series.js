const fs = require('node:fs');
const path = require('node:path');

const ROOT_DIR = process.cwd();
const SERIES_DIR = path.join(ROOT_DIR, 'benchmarks', 'results', 'series');
const SUMMARY_DIR = path.join(ROOT_DIR, 'benchmarks', 'results', 'summary');
const OUTPUT_PATH = path.join(SUMMARY_DIR, 'series-summary.json');

const METRIC_READERS = {
  runtimeMs: (result) => result.runtimeMs,
  scriptMs: (result) => (result.performanceMetrics?.ScriptDuration ?? null) * 1000,
  taskMs: (result) => (result.performanceMetrics?.TaskDuration ?? null) * 1000,
  layoutMs: (result) => (result.performanceMetrics?.LayoutDuration ?? null) * 1000,
  styleMs: (result) => (result.performanceMetrics?.RecalcStyleDuration ?? null) * 1000,
  heapUsedMB: (result) => (result.performanceMetrics?.JSHeapUsedSize ?? null) / (1024 * 1024),
  nodes: (result) => result.performanceMetrics?.Nodes ?? null,
  listeners: (result) => result.performanceMetrics?.JSEventListeners ?? null,
  fps: (result) => result.runtimeQuality?.approximateFps ?? null,
  p95FrameMs: (result) => result.runtimeQuality?.p95FrameDeltaMs ?? null,
  droppedFramePct: (result) => (result.runtimeQuality?.droppedFrameRatio ?? null) * 100,
  tbtMs: (result) => result.runtimeQuality?.totalBlockingTimeMs ?? null,
  fmpMs: (result) => {
    const metrics = result.performanceMetrics ?? {};
    if (typeof metrics.FirstMeaningfulPaint !== 'number' || typeof metrics.NavigationStart !== 'number') {
      return null;
    }
    return (metrics.FirstMeaningfulPaint - metrics.NavigationStart) * 1000;
  },
  dclMs: (result) => {
    const metrics = result.performanceMetrics ?? {};
    if (typeof metrics.DomContentLoaded !== 'number' || typeof metrics.NavigationStart !== 'number') {
      return null;
    }
    return (metrics.DomContentLoaded - metrics.NavigationStart) * 1000;
  },
};

function mean(values) {
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function standardDeviation(values) {
  if (values.length <= 1) {
    return 0;
  }
  const valueMean = mean(values);
  const variance = values.reduce((sum, value) => sum + (value - valueMean) ** 2, 0) / (values.length - 1);
  return Math.sqrt(variance);
}

function standardError(values) {
  if (!values.length) {
    return null;
  }
  return standardDeviation(values) / Math.sqrt(values.length);
}

function summarizeMetric(values) {
  const filtered = values.filter((value) => typeof value === 'number' && Number.isFinite(value));

  if (!filtered.length) {
    return {
      n: 0,
      mean: null,
      stddev: null,
      sem: null,
      min: null,
      max: null,
    };
  }

  return {
    n: filtered.length,
    mean: mean(filtered),
    stddev: standardDeviation(filtered),
    sem: standardError(filtered),
    min: Math.min(...filtered),
    max: Math.max(...filtered),
  };
}

function loadSeriesResults() {
  if (!fs.existsSync(SERIES_DIR)) {
    throw new Error(`Series directory not found: ${SERIES_DIR}`);
  }

  const runs = fs.readdirSync(SERIES_DIR).filter((name) => name.startsWith('run-')).sort();
  const results = [];

  for (const runId of runs) {
    const runDir = path.join(SERIES_DIR, runId);
    for (const fileName of fs.readdirSync(runDir).filter((name) => name.endsWith('.json')).sort()) {
      const payload = JSON.parse(fs.readFileSync(path.join(runDir, fileName), 'utf8'));
      results.push({ runId, payload });
    }
  }

  return results;
}

function buildSummary(results) {
  const groups = new Map();

  for (const { runId, payload } of results) {
    const key = `${payload.framework}:${payload.scenario.name}`;
    const entries = groups.get(key) ?? [];
    entries.push({ runId, payload });
    groups.set(key, entries);
  }

  return [...groups.entries()].map(([key, entries]) => {
    const [framework, scenarioName] = key.split(':');
    const scenario = entries[0].payload.scenario;
    const metrics = Object.fromEntries(
      Object.entries(METRIC_READERS).map(([metricKey, readMetric]) => [
        metricKey,
        summarizeMetric(entries.map(({ payload }) => readMetric(payload))),
      ]),
    );

    return {
      framework,
      scenarioName,
      scenario,
      runCount: entries.length,
      metrics,
    };
  }).sort((left, right) => `${left.framework}:${left.scenarioName}`.localeCompare(`${right.framework}:${right.scenarioName}`));
}

function main() {
  const results = loadSeriesResults();
  const summary = {
    generatedAt: new Date().toISOString(),
    totalRuns: new Set(results.map((entry) => entry.runId)).size,
    combinations: buildSummary(results),
  };

  fs.mkdirSync(SUMMARY_DIR, { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(summary, null, 2));
  console.log(`Saved aggregated benchmark series summary to ${OUTPUT_PATH}`);
}

main();