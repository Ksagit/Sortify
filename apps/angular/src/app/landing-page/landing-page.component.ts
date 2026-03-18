import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { RouterLink } from '@angular/router';

import { HlmBadgeImports } from '@spartan-ng/helm/badge';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';

import { SortingPlayer } from '../sorting/sorting-player';
import { quickSortSteps } from '../sorting/sorting.algorithms';
import { SortingProgressChartComponent } from '../ui/sorting-progress-chart/sorting-progress-chart.component';

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
  readonly quickSortPreview = new SortingPlayer(quickSortSteps, {
    size: 28,
    min: 10,
    max: 120,
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
      title: 'Multiple data sets',
      description: 'Test with different array sizes and data patterns.',
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

  ngOnDestroy() {
    this.quickSortPreview.destroy();
  }
}
