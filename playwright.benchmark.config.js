const { defineConfig } = require('@playwright/test');

const reactBaseURL =
  process.env.BENCHMARK_REACT_BASE_URL || 'http://127.0.0.1:4173';
const angularBaseURL =
  process.env.BENCHMARK_ANGULAR_BASE_URL || 'http://127.0.0.1:4200';

module.exports = defineConfig({
  testDir: './benchmarks',
  timeout: 90_000,
  expect: {
    timeout: 15_000,
  },
  fullyParallel: false,
  workers: 1,
  outputDir: 'benchmarks/results/artifacts',
  reporter: [
    ['list'],
    ['html', { open: 'never', outputFolder: 'benchmarks/results/report' }],
  ],
  use: {
    browserName: 'chromium',
    headless: true,
    ignoreHTTPSErrors: true,
    trace: 'off',
    viewport: {
      width: 1440,
      height: 900,
    },
  },
  projects: [
    {
      name: 'react',
      use: {
        baseURL: reactBaseURL,
      },
    },
    {
      name: 'angular',
      use: {
        baseURL: angularBaseURL,
      },
    },
  ],
});