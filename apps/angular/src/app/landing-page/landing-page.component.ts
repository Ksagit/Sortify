import { ChangeDetectionStrategy, Component, OnDestroy, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { HlmBadgeImports } from '@spartan-ng/helm/badge';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';

import { SortingPlayer } from '../sorting/sorting-player';
import {
  bubbleSortSteps,
  insertionSortSteps,
  mergeSortSteps,
  quickSortSteps,
} from '../sorting/sorting.algorithms';
import { SortingProgressChartComponent } from '../ui/sorting-progress-chart/sorting-progress-chart.component';

const PREVIEW_SEED = 20260319;
type SortingAlgorithmKey = 'bubble' | 'quick' | 'merge' | 'insertion';

const SORTING_ALGORITHM_OPTIONS: Record<
  SortingAlgorithmKey,
  { label: string; steps: typeof bubbleSortSteps }
> = {
  bubble: {
    label: 'Bubble Sort',
    steps: bubbleSortSteps,
  },
  quick: {
    label: 'Quick Sort',
    steps: quickSortSteps,
  },
  merge: {
    label: 'Merge Sort',
    steps: mergeSortSteps,
  },
  insertion: {
    label: 'Insertion Sort',
    steps: insertionSortSteps,
  },
};

const SORTING_ALGORITHM_ORDER: SortingAlgorithmKey[] = ['bubble', 'quick', 'merge', 'insertion'];

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [
    RouterLink,
    SortingProgressChartComponent,
    HlmButtonImports,
    HlmCardImports,
    HlmBadgeImports,
  ],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LandingPageComponent implements OnDestroy {
  readonly algorithmOptions = SORTING_ALGORITHM_ORDER.map((value) => ({
    value,
    label: SORTING_ALGORITHM_OPTIONS[value].label,
  }));
  readonly selectedAlgorithm = signal<SortingAlgorithmKey>('quick');
  readonly selectedAlgorithmLabel = computed(
    () => SORTING_ALGORITHM_OPTIONS[this.selectedAlgorithm()].label,
  );
  readonly quickSortPreview = new SortingPlayer(quickSortSteps, {
    size: 28,
    min: 10,
    max: 120,
    seed: PREVIEW_SEED,
    autoplay: true,
    speed: 180,
  });

  readonly algorithmCards = [
    {
      shortLabel: 'BS',
      title: 'Bubble Sort',
      description:
        'Elementary comparison-based algorithm that repeatedly compares adjacent elements and swaps them if they are in wrong order.',
      complexity: 'Quadratic complexity',
      palette: 'bubble',
    },
    {
      shortLabel: 'MS',
      title: 'Merge Sort',
      description:
        'Stable divide-and-conquer algorithm that recursively splits arrays into sublists, then merges them back in sorted order.',
      complexity: 'Linearithmic complexity',
      palette: 'merge',
    },
    {
      shortLabel: 'QS',
      title: 'Quick Sort',
      description:
        'In-place divide-and-conquer algorithm that selects a pivot element and partitions the array around it for efficient sorting.',
      complexity: 'Linearithmic average',
      palette: 'quick',
    },
    {
      shortLabel: 'IS',
      title: 'Insertion Sort',
      description:
        'Incremental in-place algorithm that keeps a sorted prefix and inserts each next value into its correct position.',
      complexity: 'Quadratic complexity',
      palette: 'merge',
    },
  ] as const;

  readonly features = [
    {
      icon: '⚡',
      title: 'Step-by-step execution',
      description: 'Watch algorithms unfold one step at a time.',
      palette: 'primary',
    },
    {
      icon: '🎛️',
      title: 'Adjustable speed',
      description: 'Control animation speed to match your pace.',
      palette: 'secondary',
    },
    {
      icon: '📊',
      title: 'Deterministic data sets',
      description: 'Replay the same seeded input across multiple algorithms.',
      palette: 'accent',
    },
    {
      icon: '📈',
      title: 'Performance comparison',
      description: 'Compare algorithms side-by-side in the same moment.',
      palette: 'danger',
    },
  ] as const;

  quickSortStepCount(): number {
    return Math.max(this.quickSortPreview.steps().length, 1);
  }

  updatePreviewAlgorithm(key: string) {
    const nextKey = key as SortingAlgorithmKey;

    this.selectedAlgorithm.set(nextKey);
    this.quickSortPreview.setStepsFactory(SORTING_ALGORITHM_OPTIONS[nextKey].steps);
    this.quickSortPreview.reconfigure({ seed: PREVIEW_SEED });
    this.quickSortPreview.play();
  }

  ngOnDestroy() {
    this.quickSortPreview.destroy();
  }
}
