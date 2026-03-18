export interface SortStep {
  values: number[];
  comparing?: number[];
  swapping?: number[];
  pivot?: number | null;
  sorted?: number[];
}

export type DataPattern = 'random' | 'sorted' | 'reversed' | 'duplicates';

export const DATA_PATTERN_LABELS: Record<DataPattern, string> = {
  random: 'Random',
  sorted: 'Sorted',
  reversed: 'Reverse Sorted',
  duplicates: 'Many Duplicates',
};

export interface SortingOptions {
  size?: number;
  min?: number;
  max?: number;
  seed?: number;
  pattern?: DataPattern;
  speed?: number;
  autoplay?: boolean;
}

export type SortingStepFactory = (values: number[]) => SortStep[];
