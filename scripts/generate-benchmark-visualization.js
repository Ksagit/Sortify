const fs = require('node:fs');
const path = require('node:path');

const ROOT_DIR = process.cwd();
const RAW_DIR = path.join(ROOT_DIR, 'benchmarks', 'results', 'raw');
const SUMMARY_DIR = path.join(ROOT_DIR, 'benchmarks', 'results', 'summary');
const SUMMARY_JSON_PATH = path.join(SUMMARY_DIR, 'summary.json');
const SUMMARY_HTML_PATH = path.join(SUMMARY_DIR, 'index.html');

const FRAMEWORK_META = {
  react: {
    label: 'React',
    color: '#0f766e',
    accent: '#14b8a6',
  },
  angular: {
    label: 'Angular',
    color: '#9f1239',
    accent: '#fb7185',
  },
};

const METRIC_DEFINITIONS = [
  { key: 'runtimeMs', label: 'Runtime', unit: 'ms', decimals: 0 },
  { key: 'scriptMs', label: 'Script Duration', unit: 'ms', decimals: 2 },
  { key: 'taskMs', label: 'Task Duration', unit: 'ms', decimals: 2 },
  { key: 'layoutMs', label: 'Layout Duration', unit: 'ms', decimals: 2 },
  { key: 'styleMs', label: 'Style Recalc', unit: 'ms', decimals: 2 },
  { key: 'fmpMs', label: 'First Meaningful Paint', unit: 'ms', decimals: 2 },
  { key: 'dclMs', label: 'DOMContentLoaded', unit: 'ms', decimals: 2 },
  { key: 'heapUsedMB', label: 'Heap Used', unit: 'MB', decimals: 2 },
  { key: 'nodes', label: 'DOM Nodes', unit: '', decimals: 0 },
  { key: 'listeners', label: 'JS Event Listeners', unit: '', decimals: 0 },
];

function secondsToMilliseconds(value) {
  return typeof value === 'number' ? value * 1000 : null;
}

function bytesToMegabytes(value) {
  return typeof value === 'number' ? value / (1024 * 1024) : null;
}

function relativeMilliseconds(timestamp, navigationStart) {
  if (typeof timestamp !== 'number' || typeof navigationStart !== 'number') {
    return null;
  }

  return (timestamp - navigationStart) * 1000;
}

function formatValue(value, decimals, unit) {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return 'n/a';
  }

  const formatted = Number(value).toLocaleString('pl-PL', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return unit ? `${formatted} ${unit}` : formatted;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function loadRawResults() {
  if (!fs.existsSync(RAW_DIR)) {
    throw new Error(`Raw results directory not found: ${RAW_DIR}`);
  }

  const files = fs
    .readdirSync(RAW_DIR)
    .filter((fileName) => fileName.endsWith('.json'))
    .sort();

  return files.map((fileName) => {
    const filePath = path.join(RAW_DIR, fileName);
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content);
  });
}

function normalizeResult(result) {
  const metrics = result.performanceMetrics ?? {};
  const framework = result.framework;
  const frameworkMeta = FRAMEWORK_META[framework] ?? {
    label: framework,
    color: '#334155',
    accent: '#64748b',
  };

  return {
    framework,
    frameworkLabel: frameworkMeta.label,
    colors: frameworkMeta,
    scenario: result.scenario,
    runtimeMs: result.runtimeMs,
    scriptMs: secondsToMilliseconds(metrics.ScriptDuration),
    taskMs: secondsToMilliseconds(metrics.TaskDuration),
    layoutMs: secondsToMilliseconds(metrics.LayoutDuration),
    styleMs: secondsToMilliseconds(metrics.RecalcStyleDuration),
    fmpMs: relativeMilliseconds(metrics.FirstMeaningfulPaint, metrics.NavigationStart),
    dclMs: relativeMilliseconds(metrics.DomContentLoaded, metrics.NavigationStart),
    heapUsedMB: bytesToMegabytes(metrics.JSHeapUsedSize),
    heapTotalMB: bytesToMegabytes(metrics.JSHeapTotalSize),
    nodes: metrics.Nodes ?? null,
    listeners: metrics.JSEventListeners ?? null,
    layoutCount: metrics.LayoutCount ?? null,
    styleCount: metrics.RecalcStyleCount ?? null,
    initialSnapshot: result.initialSnapshot,
    finalSnapshot: result.finalSnapshot,
  };
}

function buildSummary(results) {
  const normalized = results.map(normalizeResult);
  const grouped = new Map();

  for (const result of normalized) {
    const scenarioName = result.scenario?.name ?? 'unknown';
    const current = grouped.get(scenarioName) ?? [];
    current.push(result);
    grouped.set(scenarioName, current);
  }

  const scenarios = [...grouped.entries()].map(([name, entries]) => ({
    name,
    scenario: entries[0]?.scenario,
    results: entries.sort((left, right) => left.frameworkLabel.localeCompare(right.frameworkLabel, 'pl')),
  }));

  return {
    generatedAt: new Date().toISOString(),
    scenarioCount: scenarios.length,
    frameworks: [...new Set(normalized.map((result) => result.frameworkLabel))],
    scenarios,
  };
}

function renderMetricRows(results, metricDefinition) {
  const values = results
    .map((result) => result[metricDefinition.key])
    .filter((value) => typeof value === 'number');
  const maxValue = values.length ? Math.max(...values) : 0;

  return results
    .map((result) => {
      const value = result[metricDefinition.key];
      const width = maxValue > 0 && typeof value === 'number' ? Math.max((value / maxValue) * 100, 4) : 0;

      return `
        <div class="metric-row">
          <div class="metric-row__label">
            <span class="framework-chip" style="--chip-bg:${result.colors.color}; --chip-accent:${result.colors.accent}">${escapeHtml(result.frameworkLabel)}</span>
            <strong>${formatValue(value, metricDefinition.decimals, metricDefinition.unit)}</strong>
          </div>
          <div class="metric-row__bar-shell">
            <div class="metric-row__bar" style="width:${width}%; --bar-bg:${result.colors.color}; --bar-accent:${result.colors.accent}"></div>
          </div>
        </div>`;
    })
    .join('');
}

function renderAlgorithmTable(results) {
  const rows = results[0]?.finalSnapshot?.sorters ?? [];
  if (!rows.length) {
    return '<p class="empty-state">Brak danych o finalnych krokach algorytmów.</p>';
  }

  const body = rows
    .map((sorter) => {
      const cells = results
        .map((result) => {
          const matching = result.finalSnapshot?.sorters?.find((entry) => entry.key === sorter.key);
          if (!matching) {
            return '<td>n/a</td>';
          }

          return `<td>${matching.stepCount}</td>`;
        })
        .join('');

      return `<tr><th>${escapeHtml(sorter.label)}</th>${cells}</tr>`;
    })
    .join('');

  const headers = results.map((result) => `<th>${escapeHtml(result.frameworkLabel)}</th>`).join('');

  return `
    <table class="algorithm-table">
      <thead>
        <tr>
          <th>Algorytm</th>
          ${headers}
        </tr>
      </thead>
      <tbody>
        ${body}
      </tbody>
    </table>`;
}

function renderScenarioSection(section) {
  const metricCards = METRIC_DEFINITIONS.map(
    (metricDefinition) => `
      <article class="metric-card">
        <header>
          <h3>${escapeHtml(metricDefinition.label)}</h3>
        </header>
        ${renderMetricRows(section.results, metricDefinition)}
      </article>`,
  ).join('');

  const scenario = section.scenario ?? {};
  const meta = [
    `seed: ${scenario.seed ?? 'n/a'}`,
    `size: ${scenario.size ?? 'n/a'}`,
    `pattern: ${scenario.pattern ?? 'n/a'}`,
    `delay: ${scenario.delay ?? 'n/a'} ms`,
  ];

  return `
    <section class="scenario-section">
      <div class="scenario-header">
        <div>
          <p class="eyebrow">Scenariusz</p>
          <h2>${escapeHtml(section.name)}</h2>
        </div>
        <div class="scenario-meta">${meta.map((item) => `<span>${escapeHtml(item)}</span>`).join('')}</div>
      </div>
      <div class="metric-grid">
        ${metricCards}
      </div>
      <section class="details-card">
        <header>
          <h3>Liczba kroków algorytmów</h3>
          <p>Weryfikacja, czy oba frameworki odtworzyły identyczną sekwencję kroków.</p>
        </header>
        ${renderAlgorithmTable(section.results)}
      </section>
    </section>`;
}

function generateHtml(summary) {
  const scenarioSections = summary.scenarios.map(renderScenarioSection).join('');

  return `<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Benchmark Summary</title>
  <style>
    :root {
      --bg: #f5efe6;
      --panel: rgba(255, 252, 246, 0.88);
      --panel-strong: #fffaf0;
      --text: #1c1917;
      --muted: #57534e;
      --border: rgba(120, 113, 108, 0.18);
      --shadow: 0 24px 60px rgba(28, 25, 23, 0.08);
    }

    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: Georgia, 'Times New Roman', serif;
      background:
        radial-gradient(circle at top left, rgba(20, 184, 166, 0.16), transparent 34%),
        radial-gradient(circle at top right, rgba(251, 113, 133, 0.16), transparent 30%),
        linear-gradient(180deg, #fcfbf7 0%, var(--bg) 100%);
      color: var(--text);
    }

    .page {
      width: min(1180px, calc(100% - 48px));
      margin: 0 auto;
      padding: 40px 0 64px;
    }

    .hero,
    .scenario-section,
    .details-card {
      background: var(--panel);
      border: 1px solid var(--border);
      border-radius: 28px;
      box-shadow: var(--shadow);
      backdrop-filter: blur(16px);
    }

    .hero {
      padding: 32px;
      margin-bottom: 24px;
    }

    .eyebrow {
      margin: 0 0 8px;
      text-transform: uppercase;
      letter-spacing: 0.14em;
      font-size: 12px;
      color: var(--muted);
    }

    h1, h2, h3, p { margin: 0; }

    h1 {
      font-size: clamp(34px, 5vw, 56px);
      line-height: 1.04;
      max-width: 12ch;
      margin-bottom: 12px;
    }

    .hero p {
      color: var(--muted);
      max-width: 72ch;
      line-height: 1.55;
    }

    .hero-stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 12px;
      margin-top: 24px;
    }

    .hero-stat {
      padding: 18px 20px;
      border-radius: 18px;
      background: var(--panel-strong);
      border: 1px solid var(--border);
    }

    .hero-stat strong {
      display: block;
      font-size: 28px;
      margin-bottom: 6px;
    }

    .hero-stat span {
      color: var(--muted);
      font-size: 14px;
    }

    .scenario-section {
      padding: 24px;
      margin-top: 24px;
    }

    .scenario-header {
      display: flex;
      justify-content: space-between;
      gap: 16px;
      align-items: start;
      margin-bottom: 20px;
    }

    .scenario-header h2 {
      font-size: clamp(24px, 3vw, 36px);
    }

    .scenario-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      justify-content: flex-end;
    }

    .scenario-meta span {
      padding: 8px 12px;
      border-radius: 999px;
      background: var(--panel-strong);
      border: 1px solid var(--border);
      color: var(--muted);
      font-size: 13px;
    }

    .metric-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: 14px;
    }

    .metric-card,
    .details-card {
      padding: 18px;
      background: var(--panel-strong);
      border: 1px solid var(--border);
      border-radius: 22px;
    }

    .metric-card h3,
    .details-card h3 {
      font-size: 18px;
      margin-bottom: 14px;
    }

    .metric-row + .metric-row {
      margin-top: 12px;
    }

    .metric-row__label {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      align-items: center;
      margin-bottom: 8px;
      font-size: 14px;
    }

    .framework-chip {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 7px 12px;
      border-radius: 999px;
      color: white;
      background: linear-gradient(90deg, var(--chip-bg), var(--chip-accent));
      font-size: 12px;
      letter-spacing: 0.04em;
      text-transform: uppercase;
    }

    .metric-row__bar-shell {
      height: 12px;
      border-radius: 999px;
      overflow: hidden;
      background: rgba(120, 113, 108, 0.1);
    }

    .metric-row__bar {
      height: 100%;
      border-radius: 999px;
      background: linear-gradient(90deg, var(--bar-bg), var(--bar-accent));
      transition: width 240ms ease;
    }

    .details-card {
      margin-top: 18px;
    }

    .details-card header {
      margin-bottom: 14px;
    }

    .details-card p {
      color: var(--muted);
      line-height: 1.5;
      margin-top: 6px;
    }

    .algorithm-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 14px;
    }

    .algorithm-table th,
    .algorithm-table td {
      padding: 12px 10px;
      text-align: left;
      border-bottom: 1px solid var(--border);
    }

    .algorithm-table thead th {
      color: var(--muted);
      font-weight: 600;
    }

    .algorithm-table tbody tr:last-child th,
    .algorithm-table tbody tr:last-child td {
      border-bottom: none;
    }

    .footer {
      margin-top: 24px;
      color: var(--muted);
      font-size: 13px;
    }

    .empty-state {
      color: var(--muted);
    }

    @media (max-width: 720px) {
      .page {
        width: min(100% - 24px, 1180px);
        padding-top: 20px;
      }

      .hero,
      .scenario-section {
        padding: 20px;
      }

      .scenario-header {
        flex-direction: column;
      }

      .scenario-meta {
        justify-content: flex-start;
      }
    }
  </style>
</head>
<body>
  <main class="page">
    <section class="hero">
      <p class="eyebrow">Sortify Benchmark Report</p>
      <h1>Porównanie wyników renderowania i kosztów runtime.</h1>
      <p>Raport został wygenerowany automatycznie z plików JSON zapisanych przez harness Playwright. Sekcje poniżej pokazują porównanie React i Angular dla każdego scenariusza testowego oraz kontrolę zgodności liczby kroków algorytmów.</p>
      <div class="hero-stats">
        <article class="hero-stat">
          <strong>${summary.scenarioCount}</strong>
          <span>Liczba scenariuszy</span>
        </article>
        <article class="hero-stat">
          <strong>${summary.frameworks.length}</strong>
          <span>Porównywane frameworki</span>
        </article>
        <article class="hero-stat">
          <strong>${new Date(summary.generatedAt).toLocaleString('pl-PL')}</strong>
          <span>Czas wygenerowania raportu</span>
        </article>
      </div>
    </section>
    ${scenarioSections || '<p class="empty-state">Brak wyników do wizualizacji.</p>'}
    <p class="footer">Źródło danych: benchmarks/results/raw/*.json</p>
  </main>
</body>
</html>`;
}

function main() {
  const rawResults = loadRawResults();
  const summary = buildSummary(rawResults);
  const html = generateHtml(summary);

  fs.mkdirSync(SUMMARY_DIR, { recursive: true });
  fs.writeFileSync(SUMMARY_JSON_PATH, JSON.stringify(summary, null, 2));
  fs.writeFileSync(SUMMARY_HTML_PATH, html);

  console.log(`Generated summary JSON: ${SUMMARY_JSON_PATH}`);
  console.log(`Generated summary HTML: ${SUMMARY_HTML_PATH}`);
}

main();
