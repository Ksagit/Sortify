import { computed, signal } from '@angular/core';

import { createInputArray } from './sorting.algorithms';
import { SortStep, SortingOptions, SortingStepFactory } from './sorting.models';

export class SortingPlayer {
  private readonly settings: Required<SortingOptions>;
  private readonly autoAdvance: boolean;
  private timerId: number | null = null;
  private readonly stepsFactorySignal;

  readonly array;
  readonly index = signal(0);
  readonly isPlaying;
  readonly speed;
  readonly steps;
  readonly step;
  readonly isDone;

  constructor(stepsFactory: SortingStepFactory, options: SortingOptions = {}) {
    this.settings = {
      size: options.size ?? 32,
      min: options.min ?? 10,
      max: options.max ?? 120,
      seed: options.seed ?? 20260318,
      pattern: options.pattern ?? 'random',
      speed: options.speed ?? 200,
      autoplay: options.autoplay ?? true,
    };

    this.autoAdvance = this.settings.autoplay;
    this.stepsFactorySignal = signal(stepsFactory);
    this.array = signal(
      createInputArray(
        this.settings.size,
        this.settings.min,
        this.settings.max,
        this.settings.seed,
        this.settings.pattern,
      ),
    );
    this.isPlaying = signal(this.settings.autoplay);
    this.speed = signal(this.settings.speed);
    this.steps = computed(() => this.stepsFactorySignal()(this.array()));
    this.step = computed<SortStep>(() => {
      const steps = this.steps();

      if (steps.length === 0) {
        return { values: [] };
      }

      return steps[Math.min(this.index(), steps.length - 1)] ?? { values: [] };
    });
    this.isDone = computed(
      () => this.steps().length > 0 && this.index() >= this.steps().length - 1,
    );

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

  setStepsFactory(stepsFactory: SortingStepFactory) {
    this.stepsFactorySignal.set(stepsFactory);
    this.index.set(0);

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

  reconfigure(options: Partial<SortingOptions>) {
    this.settings.size = options.size ?? this.settings.size;
    this.settings.min = options.min ?? this.settings.min;
    this.settings.max = options.max ?? this.settings.max;
    this.settings.seed = options.seed ?? this.settings.seed;
    this.settings.pattern = options.pattern ?? this.settings.pattern;

    this.array.set(
      createInputArray(
        this.settings.size,
        this.settings.min,
        this.settings.max,
        this.settings.seed,
        this.settings.pattern,
      ),
    );
    this.index.set(0);

    if (this.autoAdvance && this.isPlaying()) {
      this.restartTimer();
    }
  }

  shuffle(seed = this.settings.seed, pattern = this.settings.pattern) {
    this.settings.seed = seed;
    this.settings.pattern = pattern;
    this.array.set(
      createInputArray(this.settings.size, this.settings.min, this.settings.max, seed, pattern),
    );
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

    this.timerId = window.setInterval(() => this.next(), Math.max(1, this.speed()));
  }

  private clearTimer() {
    if (this.timerId !== null) {
      window.clearInterval(this.timerId);
      this.timerId = null;
    }
  }
}
