const renderScenarios = [
  {
    name: 'baseline-random-32',
    size: 32,
    pattern: 'random',
    delay: 1,
    seed: 20260318,
    algorithms: ['bubble', 'quick', 'merge', 'insertion'],
    autoplay: true,
    timeoutMs: 30_000,
  },
  {
    name: 'stress-duplicates-256',
    size: 256,
    pattern: 'duplicates',
    delay: 1,
    seed: 20260318,
    algorithms: ['bubble', 'quick', 'merge', 'insertion'],
    autoplay: true,
    timeoutMs: 240_000,
  },
];

function buildBenchmarkUrl(baseURL, scenario) {
  const url = new URL('/dashboard', baseURL);

  url.searchParams.set('benchmark', '1');
  url.searchParams.set('autoplay', scenario.autoplay === false ? '0' : '1');
  url.searchParams.set('delay', String(scenario.delay));
  url.searchParams.set('size', String(scenario.size));
  url.searchParams.set('pattern', scenario.pattern);
  url.searchParams.set('seed', String(scenario.seed));
  url.searchParams.set('algorithms', scenario.algorithms.join(','));

  return url.toString();
}

module.exports = {
  renderScenarios,
  buildBenchmarkUrl,
};