import { computed, signal } from '@angular/core';

import { randomArray } from './sorting.algorithms';
import { SortStep, SortingOptions, SortingStepFactory } from './sorting.models';

export class SortingPlayer {
  private readonly settings: Required<SortingOptions>;
  private readonly autoAdvance: boolean;
  private timerId: number | null = null;

  readonly array;
  readonly index = signal(0);
  readonly isPlaying;
  readonly speed;
  readonly steps;
  readonly step;
  readonly isDone;

  constructor(private readonly stepsFactory: SortingStepFactory, options: SortingOptions = {}) {
    this.settings = {
      size: options.size ?? 32,
      min: options.min ?? 10,
      max: options.max ?? 120,
      speed: options.speed ?? 200,
      autoplay: options.autoplay ?? true
    };

    this.autoAdvance = this.settings.autoplay;
    this.array = signal(randomArray(this.settings.size, this.settings.min, this.settings.max));
    this.isPlaying = signal(this.settings.autoplay);
    this.speed = signal(this.settings.speed);
    this.steps = computed(() => this.stepsFactory(this.array()));
    this.step = computed<SortStep>(() => {
      const steps = this.steps();

      if (steps.length === 0) {
        return { values: [] };
      }

      return steps[Math.min(this.index(), steps.length - 1)] ?? { values: [] };
    });
    this.isDone = computed(() => this.steps().length > 0 && this.index() >= this.steps().length - 1);

    if (this.autoAdvance) {
      this.restartTimer();
    }
  }

  play() {
    this.isPlaying.set(true);

    if (this.autoAdvance) {
      this.restartTimer();
    }
  }

  pause() {
    this.isPlaying.set(false);

    if (this.autoAdvance) {
      this.clearTimer();
    }
  }

  next() {
    const lastIndex = Math.max(this.steps().length - 1, 0);
    const nextIndex = Math.min(this.index() + 1, lastIndex);

    this.index.set(nextIndex);

    if (nextIndex >= lastIndex) {
      this.isPlaying.set(false);

      if (this.autoAdvance) {
        this.clearTimer();
      }
    }
  }

  prev() {
    this.index.set(Math.max(this.index() - 1, 0));
  }

  setSpeed(milliseconds: number) {
    this.speed.set(milliseconds);

    if (this.autoAdvance && this.isPlaying()) {
      this.restartTimer();
    }
  }

  restart() {
    this.index.set(0);

    if (this.autoAdvance && this.isPlaying()) {
      this.restartTimer();
    }
  }

  shuffle() {
    this.array.set(randomArray(this.settings.size, this.settings.min, this.settings.max));
    this.index.set(0);

    if (this.autoAdvance && this.isPlaying()) {
      this.restartTimer();
    }
  }

  destroy() {
    this.clearTimer();
  }

  private restartTimer() {
    this.clearTimer();

    if (typeof window === 'undefined') {
      return;
    }

    if (!this.isPlaying() || this.isDone() || this.steps().length === 0) {
      return;
    }

    this.timerId = window.setInterval(() => this.next(), Math.max(50, this.speed()));
  }

  private clearTimer() {
    if (this.timerId !== null) {
      window.clearInterval(this.timerId);
      this.timerId = null;
    }
  }
}