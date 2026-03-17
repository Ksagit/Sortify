import { ChangeDetectionStrategy, Component, OnDestroy, computed, signal } from '@angular/core';

import { HlmBadgeImports } from '@spartan-ng/helm/badge';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmSliderImports } from '@spartan-ng/helm/slider';

import { SortingPlayer } from '../sorting/sorting-player';
import {
  bubbleSortSteps,
  heapSortSteps,
  mergeSortSteps,
  quickSortSteps,
} from '../sorting/sorting.algorithms';
import { SortingProgressChartComponent } from '../ui/sorting-progress-chart/sorting-progress-chart.component';

const SPEED_MIN = 50;
const SPEED_MAX = 600;

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
  readonly bubble = new SortingPlayer(bubbleSortSteps, {
    size: 32,
    min: 10,
    max: 120,
    autoplay: false,
  });
  readonly quick = new SortingPlayer(quickSortSteps, {
    size: 32,
    min: 10,
    max: 120,
    autoplay: false,
  });
  readonly merge = new SortingPlayer(mergeSortSteps, {
    size: 32,
    min: 10,
    max: 120,
    autoplay: false,
  });
  readonly heap = new SortingPlayer(heapSortSteps, {
    size: 32,
    min: 10,
    max: 120,
    autoplay: false,
  });
  readonly speedBounds = { min: SPEED_MIN, max: SPEED_MAX };

  readonly isPlaying = signal(true);
  readonly delay = signal(200);
  readonly sliderValue = computed(() => [SPEED_MIN + SPEED_MAX - this.delay()]);

  readonly algorithms = [
    {
      name: 'Bubble Sort',
      player: this.bubble,
      accent: 'bubble',
    },
    {
      name: 'Quick Sort',
      player: this.quick,
      accent: 'quick',
    },
    {
      name: 'Merge Sort',
      player: this.merge,
      accent: 'merge',
    },
    {
      name: 'Heap Sort',
      player: this.heap,
      accent: 'heap',
    },
  ] as const;

  private readonly players = [this.bubble, this.quick, this.merge, this.heap];
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
    this.players.forEach((player) => player.shuffle());

    if (this.isPlaying()) {
      this.players.forEach((player) => player.play());
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
      Math.max(SPEED_MIN, this.delay()),
    );
  }

  private clearTimer() {
    if (this.timerId !== null) {
      window.clearInterval(this.timerId);
      this.timerId = null;
    }
  }
}
