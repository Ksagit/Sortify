import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { SortStep } from '../../sorting/sorting.models';

@Component({
  selector: 'app-sorting-progress-chart',
  standalone: true,
  templateUrl: './sorting-progress-chart.component.html',
  styleUrl: './sorting-progress-chart.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SortingProgressChartComponent {
  readonly title = input('Sorting Progress');
  readonly progress = input.required<SortStep>();
  readonly barColor = input('#1f2937');
  readonly compareColor = input('#f59e0b');
  readonly swapColor = input('#ef4444');
  readonly pivotColor = input('#3b82f6');
  readonly sortedColor = input('#10b981');
  readonly height = input(300);

  readonly bars = computed(() => {
    const progress = this.progress();
    const values = progress.values ?? [];
    const maxValue = Math.max(...values, 1);
    const comparing = new Set(progress.comparing ?? []);
    const swapping = new Set(progress.swapping ?? []);
    const sorted = new Set(progress.sorted ?? []);

    return values.map((value, index) => {
      let fill = this.barColor();

      if (sorted.has(index)) {
        fill = this.sortedColor();
      } else if (swapping.has(index)) {
        fill = this.swapColor();
      } else if (progress.pivot === index) {
        fill = this.pivotColor();
      } else if (comparing.has(index)) {
        fill = this.compareColor();
      }

      return {
        index,
        value,
        fill,
        height: `${Math.max((value / maxValue) * 100, 4)}%`,
      };
    });
  });

  readonly barCount = computed(() => this.progress().values?.length ?? 0);
  readonly isDense = computed(() => this.barCount() >= 128);
  readonly isUltraDense = computed(() => this.barCount() >= 192);
  readonly gridTemplateColumns = computed(
    () => `repeat(${Math.max(this.barCount(), 1)}, minmax(0, 1fr))`,
  );

  readonly legend = computed(() => [
    { label: 'Normal', color: this.barColor() },
    { label: 'Compare', color: this.compareColor() },
    { label: 'Swap', color: this.swapColor() },
    { label: 'Pivot', color: this.pivotColor() },
    { label: 'Sorted', color: this.sortedColor() },
  ]);

  readonly gridLines = [20, 40, 60, 80];
}
