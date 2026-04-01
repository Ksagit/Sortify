import { ChangeDetectionStrategy, Component, OnDestroy, computed, effect, signal } from '@angular/core';

import { HlmBadgeImports } from '@spartan-ng/helm/badge';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmSliderImports } from '@spartan-ng/helm/slider';

import { SortingPlayer } from '../sorting/sorting-player';
import {
  bubbleSortSteps,
  insertionSortSteps,
  mergeSortSteps,
  quickSortSteps,
} from '../sorting/sorting.algorithms';
import { DATA_PATTERN_LABELS, DataPattern } from '../sorting/sorting.models';
import { SortingProgressChartComponent } from '../ui/sorting-progress-chart/sorting-progress-chart.component';

const SPEED_MIN = 1;
const SPEED_MAX = 1000;
const DASHBOARD_SEED = 20260318;
const DATASET_SIZE_OPTIONS = [32, 64, 100, 128, 256] as const;
type SortingAlgorithmKey = 'bubble' | 'quick' | 'merge' | 'insertion';

type DashboardConfig = {
  benchmarkMode: boolean;
  autoplay: boolean;
  delay: number;
  seed: number;
  size: (typeof DATASET_SIZE_OPTIONS)[number];
  pattern: DataPattern;
  algorithms: SortingAlgorithmKey[];
};

type BenchmarkWindow = Window & {
  __SORTIFY_BENCHMARK__?: unknown;
};

const SORTING_ALGORITHM_OPTIONS: Record<
  SortingAlgorithmKey,
  { label: string; accent: string; steps: typeof bubbleSortSteps }
> = {
  bubble: {
    label: 'Bubble Sort',
    accent: 'bubble',
    steps: bubbleSortSteps,
  },
  quick: {
    label: 'Quick Sort',
    accent: 'quick',
    steps: quickSortSteps,
  },
  merge: {
    label: 'Merge Sort',
    accent: 'merge',
    steps: mergeSortSteps,
  },
  insertion: {
    label: 'Insertion Sort',
    accent: 'insertion',
    steps: insertionSortSteps,
  },
};

const SORTING_ALGORITHM_ORDER: SortingAlgorithmKey[] = ['bubble', 'quick', 'merge', 'insertion'];

const DEFAULT_DASHBOARD_CONFIG: DashboardConfig = {
  benchmarkMode: false,
  autoplay: true,
  delay: 200,
  seed: DASHBOARD_SEED,
  size: DATASET_SIZE_OPTIONS[0],
  pattern: 'random',
  algorithms: [...SORTING_ALGORITHM_ORDER],
};

function parseBooleanParam(value: string | null, fallback: boolean) {
  if (value === null) {
    return fallback;
  }

  const normalized = value.trim().toLowerCase();

  if (['1', 'true', 'yes', 'on'].includes(normalized)) {
    return true;
  }

  if (['0', 'false', 'no', 'off'].includes(normalized)) {
    return false;
  }

  return fallback;
}

function parseIntegerParam(value: string | null, fallback: number, min: number, max: number) {
  if (value === null) {
    return fallback;
  }

  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    return fallback;
  }

  return Math.min(max, Math.max(min, Math.trunc(parsed)));
}

function parseSizeParam(value: string | null) {
  const parsed = Number(value);

  if (!DATASET_SIZE_OPTIONS.includes(parsed as (typeof DATASET_SIZE_OPTIONS)[number])) {
    return DEFAULT_DASHBOARD_CONFIG.size;
  }

  return parsed as (typeof DATASET_SIZE_OPTIONS)[number];
}

function parsePatternParam(value: string | null) {
  if (value && value in DATA_PATTERN_LABELS) {
    return value as DataPattern;
  }

  return DEFAULT_DASHBOARD_CONFIG.pattern;
}

function parseAlgorithmsParam(value: string | null) {
  if (!value) {
    return [...DEFAULT_DASHBOARD_CONFIG.algorithms];
  }

  const parsed = value
    .split(',')
    .map((entry) => entry.trim())
    .filter((entry): entry is SortingAlgorithmKey => entry in SORTING_ALGORITHM_OPTIONS);

  if (!parsed.length) {
    return [...DEFAULT_DASHBOARD_CONFIG.algorithms];
  }

  return SORTING_ALGORITHM_ORDER.map((_, index) => parsed[index] ?? SORTING_ALGORITHM_ORDER[index]);
}

function readInitialDashboardConfig(): DashboardConfig {
  if (typeof window === 'undefined') {
    return DEFAULT_DASHBOARD_CONFIG;
  }

  const params = new URLSearchParams(window.location.search);

  return {
    benchmarkMode: parseBooleanParam(params.get('benchmark'), DEFAULT_DASHBOARD_CONFIG.benchmarkMode),
    autoplay: parseBooleanParam(params.get('autoplay'), DEFAULT_DASHBOARD_CONFIG.autoplay),
    delay: parseIntegerParam(params.get('delay'), DEFAULT_DASHBOARD_CONFIG.delay, SPEED_MIN, SPEED_MAX),
    seed: parseIntegerParam(
      params.get('seed'),
      DEFAULT_DASHBOARD_CONFIG.seed,
      0,
      Number.MAX_SAFE_INTEGER,
    ),
    size: parseSizeParam(params.get('size')),
    pattern: parsePatternParam(params.get('pattern')),
    algorithms: parseAlgorithmsParam(params.get('algorithms')),
  };
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    SortingProgressChartComponent,
    HlmButtonImports,
    HlmCardImports,
    HlmBadgeImports,
    HlmSliderImports,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnDestroy {
  private readonly initialConfig = readInitialDashboardConfig();
  readonly dataPatternLabels = DATA_PATTERN_LABELS;
  readonly dataSizeOptions = DATASET_SIZE_OPTIONS;
  readonly algorithmOptions = SORTING_ALGORITHM_ORDER.map((value) => ({
    value,
    label: SORTING_ALGORITHM_OPTIONS[value].label,
  }));
  readonly dataPatternOptions = Object.entries(DATA_PATTERN_LABELS).map(([value, label]) => ({
    value: value as DataPattern,
    label,
  }));
  readonly bubble = new SortingPlayer(bubbleSortSteps, {
    size: this.initialConfig.size,
    min: 10,
    max: 120,
    seed: this.initialConfig.seed,
    pattern: this.initialConfig.pattern,
    autoplay: false,
  });
  readonly quick = new SortingPlayer(quickSortSteps, {
    size: this.initialConfig.size,
    min: 10,
    max: 120,
    seed: this.initialConfig.seed,
    pattern: this.initialConfig.pattern,
    autoplay: false,
  });
  readonly merge = new SortingPlayer(mergeSortSteps, {
    size: this.initialConfig.size,
    min: 10,
    max: 120,
    seed: this.initialConfig.seed,
    pattern: this.initialConfig.pattern,
    autoplay: false,
  });
  readonly insertion = new SortingPlayer(insertionSortSteps, {
    size: this.initialConfig.size,
    min: 10,
    max: 120,
    seed: this.initialConfig.seed,
    pattern: this.initialConfig.pattern,
    autoplay: false,
  });
  readonly speedBounds = { min: SPEED_MIN, max: SPEED_MAX };
  readonly benchmarkMode = this.initialConfig.benchmarkMode;
  readonly benchmarkReady = signal(false);

  readonly isPlaying = signal(this.initialConfig.autoplay);
  readonly delay = signal(this.initialConfig.delay);
  readonly datasetSize = signal<(typeof DATASET_SIZE_OPTIONS)[number]>(this.initialConfig.size);
  readonly dataPattern = signal<DataPattern>(this.initialConfig.pattern);
  readonly selectedAlgorithms = signal<SortingAlgorithmKey[]>([...this.initialConfig.algorithms]);
  readonly sliderValue = computed(() => [SPEED_MIN + SPEED_MAX - this.delay()]);
  readonly chartHeight = computed(() => {
    const size = this.datasetSize();

    if (size >= 256) {
      return 112;
    }

    if (size >= 128) {
      return 124;
    }

    if (size >= 100) {
      return 136;
    }

    return 148;
  });

  private readonly players = [this.bubble, this.quick, this.merge, this.insertion];
  readonly algorithms = computed(() =>
    this.selectedAlgorithms().map((key, index) => ({
      id: index,
      key,
      name: SORTING_ALGORITHM_OPTIONS[key].label,
      accent: SORTING_ALGORITHM_OPTIONS[key].accent,
      player: this.players[index],
    })),
  );
  private currentSeed = this.initialConfig.seed;
  private timerId: number | null = null;

  constructor() {
    this.syncPlayers();
    this.restartTimer();
    effect(() => {
      this.publishBenchmarkSnapshot();
    });
    this.benchmarkReady.set(true);
  }

  togglePlayback() {
    this.isPlaying.update((value) => !value);
    this.syncPlayers();
    this.restartTimer();
  }

  restart() {
    this.players.forEach((player) => player.restart());

    if (this.isPlaying()) {
      this.players.forEach((player) => player.play());
      this.restartTimer();
    }
  }

  shuffle() {
    this.currentSeed += 1;
    this.players.forEach((player) => player.shuffle(this.currentSeed, this.dataPattern()));

    if (this.isPlaying()) {
      this.players.forEach((player) => player.play());
      this.restartTimer();
    }
  }

  updateDataPattern(pattern: string) {
    const nextPattern = pattern as DataPattern;

    this.dataPattern.set(nextPattern);
    this.players.forEach((player) => player.shuffle(this.currentSeed, nextPattern));

    if (this.isPlaying()) {
      this.players.forEach((player) => player.play());
      this.restartTimer();
    }
  }

  updateDatasetSize(size: string) {
    const nextSize = Number(size) as (typeof DATASET_SIZE_OPTIONS)[number];

    this.datasetSize.set(nextSize);
    this.players.forEach((player) =>
      player.reconfigure({ size: nextSize, seed: this.currentSeed, pattern: this.dataPattern() }),
    );

    if (this.isPlaying()) {
      this.players.forEach((player) => player.play());
      this.restartTimer();
    }
  }

  updateAlgorithm(index: number, key: string) {
    const nextKey = key as SortingAlgorithmKey;

    this.selectedAlgorithms.update((current) => {
      const next = [...current];
      next[index] = nextKey;
      return next;
    });

    const player = this.players[index];
    player.setStepsFactory(SORTING_ALGORITHM_OPTIONS[nextKey].steps);
    player.reconfigure({
      size: this.datasetSize(),
      seed: this.currentSeed,
      pattern: this.dataPattern(),
    });

    if (this.isPlaying()) {
      player.play();
      this.restartTimer();
    }
  }

  updateSpeed(value: number[]) {
    const nextValue = value[0] ?? SPEED_MIN + SPEED_MAX - this.delay();
    const nextDelay = SPEED_MIN + SPEED_MAX - nextValue;

    this.delay.set(nextDelay);
    this.players.forEach((player) => player.setSpeed(nextDelay));
    this.restartTimer();
  }

  stepCount(player: SortingPlayer): number {
    return Math.max(player.steps().length, 1);
  }

  statusLabel(player: SortingPlayer): string {
    if (player.isDone()) {
      return 'Completed';
    }

    return player.isPlaying() ? 'Sorting' : 'Paused';
  }

  statusVariant(player: SortingPlayer): 'default' | 'secondary' | 'outline' {
    if (player.isDone()) {
      return 'secondary';
    }

    return player.isPlaying() ? 'default' : 'outline';
  }

  ngOnDestroy() {
    this.clearTimer();
    this.players.forEach((player) => player.destroy());
  }

  private publishBenchmarkSnapshot() {
    if (typeof window === 'undefined') {
      return;
    }

    const benchmarkWindow = window as BenchmarkWindow;
    const algorithms = this.algorithms();

    benchmarkWindow.__SORTIFY_BENCHMARK__ = {
      framework: 'angular',
      ready: this.benchmarkReady(),
      benchmarkMode: this.benchmarkMode,
      autoplay: this.isPlaying(),
      delay: this.delay(),
      datasetSeed: this.currentSeed,
      datasetSize: this.datasetSize(),
      dataPattern: this.dataPattern(),
      selectedAlgorithms: this.selectedAlgorithms(),
      completed: algorithms.every((algorithm) => algorithm.player.isDone()),
      sorters: algorithms.map((algorithm) => ({
        id: algorithm.id,
        key: algorithm.key,
        label: algorithm.name,
        index: algorithm.player.index(),
        stepCount: algorithm.player.steps().length,
        isDone: algorithm.player.isDone(),
        isPlaying: algorithm.player.isPlaying(),
        status: this.statusLabel(algorithm.player),
      })),
    };
  }

  private syncPlayers() {
    this.players.forEach((player) => {
      player.setSpeed(this.delay());

      if (this.isPlaying()) {
        player.play();
      } else {
        player.pause();
      }
    });
  }

  private restartTimer() {
    this.clearTimer();

    if (typeof window === 'undefined' || !this.isPlaying()) {
      return;
    }

    if (this.players.every((player) => player.isDone())) {
      this.isPlaying.set(false);
      this.syncPlayers();
      return;
    }

    this.timerId = window.setInterval(
      () => {
        this.players.forEach((player) => player.next());

        if (this.players.every((player) => player.isDone())) {
          this.isPlaying.set(false);
          this.syncPlayers();
          this.clearTimer();
        }
      },
      Math.max(1, this.delay()),
    );
  }

  private clearTimer() {
    if (this.timerId !== null) {
      window.clearInterval(this.timerId);
      this.timerId = null;
    }
  }
}
