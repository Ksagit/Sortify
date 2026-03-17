export interface SortStep {
  values: number[];
  comparing?: number[];
  swapping?: number[];
  pivot?: number | null;
  sorted?: number[];
}

export interface SortingOptions {
  size?: number;
  min?: number;
  max?: number;
  speed?: number;
  autoplay?: boolean;
}

export type SortingStepFactory = (values: number[]) => SortStep[];