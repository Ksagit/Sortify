import {
  bubbleSortSteps,
  insertionSortSteps,
  mergeSortSteps,
  quickSortSteps,
  type SortStep,
} from "src/hooks/useSorting";

type SortingStepFactory = (values: number[]) => SortStep[];

export type SortingAlgorithmKey = "bubble" | "quick" | "merge" | "insertion";

type SortingAlgorithmDefinition = {
  label: string;
  accent: string;
  steps: SortingStepFactory;
};

export const SORTING_ALGORITHMS: Record<
  SortingAlgorithmKey,
  SortingAlgorithmDefinition
> = {
  bubble: {
    label: "Bubble Sort",
    accent: "from-amber-500/80 to-transparent",
    steps: bubbleSortSteps,
  },
  quick: {
    label: "Quick Sort",
    accent: "from-blue-500/80 to-transparent",
    steps: quickSortSteps,
  },
  merge: {
    label: "Merge Sort",
    accent: "from-emerald-500/80 to-transparent",
    steps: mergeSortSteps,
  },
  insertion: {
    label: "Insertion Sort",
    accent: "from-violet-500/80 to-transparent",
    steps: insertionSortSteps,
  },
};

export const SORTING_ALGORITHM_ORDER: SortingAlgorithmKey[] = [
  "bubble",
  "quick",
  "merge",
  "insertion",
];
