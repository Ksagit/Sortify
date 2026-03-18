import { ChangeDetectionStrategy, Component, OnDestroy, computed, signal } from '@angular/core';

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
    size: DATASET_SIZE_OPTIONS[0],
    min: 10,
    max: 120,
    seed: DASHBOARD_SEED,
    pattern: 'random',
    autoplay: false,
  });
  readonly quick = new SortingPlayer(quickSortSteps, {
    size: DATASET_SIZE_OPTIONS[0],
    min: 10,
    max: 120,
    seed: DASHBOARD_SEED,
    pattern: 'random',
    autoplay: false,
  });
  readonly merge = new SortingPlayer(mergeSortSteps, {
    size: DATASET_SIZE_OPTIONS[0],
    min: 10,
    max: 120,
    seed: DASHBOARD_SEED,
    pattern: 'random',
    autoplay: false,
  });
  readonly insertion = new SortingPlayer(insertionSortSteps, {
    size: DATASET_SIZE_OPTIONS[0],
    min: 10,
    max: 120,
    seed: DASHBOARD_SEED,
    pattern: 'random',
    autoplay: false,
  });
  readonly speedBounds = { min: SPEED_MIN, max: SPEED_MAX };

  readonly isPlaying = signal(true);
  readonly delay = signal(200);
  readonly datasetSize = signal<(typeof DATASET_SIZE_OPTIONS)[number]>(DATASET_SIZE_OPTIONS[0]);
  readonly dataPattern = signal<DataPattern>('random');
  readonly selectedAlgorithms = signal<SortingAlgorithmKey[]>([...SORTING_ALGORITHM_ORDER]);
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
  private currentSeed = DASHBOARD_SEED;
  private timerId: number | null = null;

  constructor() {
    this.syncPlayers();
    this.restartTimer();
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
