import { DataPattern, SortStep } from './sorting.models';

function createSeededRng(seed: number) {
  let state = seed >>> 0;

  return () => {
    state += 0x6d2b79f5;
    let next = state;
    next = Math.imul(next ^ (next >>> 15), next | 1);
    next ^= next + Math.imul(next ^ (next >>> 7), next | 61);
    return ((next ^ (next >>> 14)) >>> 0) / 4294967296;
  };
}

export function randomArray(size: number, min = 5, max = 100, seed?: number): number[] {
  const random = typeof seed === 'number' ? createSeededRng(seed) : () => Math.random();

  return Array.from({ length: size }, () => Math.floor(random() * (max - min + 1)) + min);
}

export function createInputArray(
  size: number,
  min = 5,
  max = 100,
  seed?: number,
  pattern: DataPattern = 'random',
): number[] {
  const base = randomArray(size, min, max, seed);

  if (pattern === 'sorted') {
    return [...base].sort((left, right) => left - right);
  }

  if (pattern === 'reversed') {
    return [...base].sort((left, right) => right - left);
  }

  if (pattern === 'duplicates') {
    const duplicateRange = Math.max(2, Math.min(8, Math.floor(size / 4) || 2));
    return randomArray(size, min, Math.min(max, min + duplicateRange - 1), seed);
  }

  return base;
}

export function bubbleSortSteps(input: number[]): SortStep[] {
  const values = [...input];
  const length = values.length;
  const steps: SortStep[] = [{ values: [...values], sorted: [] }];
  const sortedSet = new Set<number>();

  for (let outer = 0; outer < length; outer += 1) {
    let swapped = false;

    for (let inner = 0; inner < length - 1 - outer; inner += 1) {
      steps.push({
        values: [...values],
        comparing: [inner, inner + 1],
        sorted: [...sortedSet],
      });

      if (values[inner] > values[inner + 1]) {
        [values[inner], values[inner + 1]] = [values[inner + 1], values[inner]];
        swapped = true;

        steps.push({
          values: [...values],
          swapping: [inner, inner + 1],
          sorted: [...sortedSet],
        });
      }
    }

    sortedSet.add(length - 1 - outer);
    steps.push({ values: [...values], sorted: [...sortedSet] });

    if (!swapped) {
      break;
    }
  }

  for (let index = 0; index < length; index += 1) {
    sortedSet.add(index);
  }

  steps.push({ values: [...values], sorted: [...sortedSet] });
  return steps;
}

export function quickSortSteps(input: number[]): SortStep[] {
  const values = [...input];
  const steps: SortStep[] = [{ values: [...values], sorted: [] }];
  const sorted = new Set<number>();
  const stack: Array<{ left: number; right: number }> = [{ left: 0, right: values.length - 1 }];

  while (stack.length > 0) {
    const current = stack.pop();

    if (!current) {
      continue;
    }

    const { left, right } = current;

    if (left >= right) {
      if (left === right) {
        sorted.add(left);
        steps.push({ values: [...values], sorted: [...sorted] });
      }

      continue;
    }

    const pivotIndex = right;
    const pivotValue = values[pivotIndex];
    steps.push({ values: [...values], pivot: pivotIndex, sorted: [...sorted] });

    let partitionIndex = left;

    for (let cursor = left; cursor < right; cursor += 1) {
      steps.push({
        values: [...values],
        comparing: [cursor, pivotIndex],
        pivot: pivotIndex,
        sorted: [...sorted],
      });

      if (values[cursor] < pivotValue) {
        if (partitionIndex !== cursor) {
          [values[partitionIndex], values[cursor]] = [values[cursor], values[partitionIndex]];
          steps.push({
            values: [...values],
            swapping: [partitionIndex, cursor],
            pivot: pivotIndex,
            sorted: [...sorted],
          });
        }

        partitionIndex += 1;
      }
    }

    if (partitionIndex !== pivotIndex) {
      [values[partitionIndex], values[pivotIndex]] = [values[pivotIndex], values[partitionIndex]];
      steps.push({
        values: [...values],
        swapping: [partitionIndex, pivotIndex],
        sorted: [...sorted],
      });
    }

    sorted.add(partitionIndex);
    steps.push({ values: [...values], sorted: [...sorted] });

    if (left < partitionIndex - 1) {
      stack.push({ left, right: partitionIndex - 1 });
    }

    if (partitionIndex + 1 < right) {
      stack.push({ left: partitionIndex + 1, right });
    }
  }

  if (sorted.size < values.length) {
    for (let index = 0; index < values.length; index += 1) {
      sorted.add(index);
    }

    steps.push({ values: [...values], sorted: [...sorted] });
  }

  return steps;
}

export function mergeSortSteps(input: number[]): SortStep[] {
  const values = [...input];
  const steps: SortStep[] = [{ values: [...values], sorted: [] }];
  const sorted = new Set<number>();

  function merge(leftIndex: number, middleIndex: number, rightIndex: number) {
    const left = values.slice(leftIndex, middleIndex + 1);
    const right = values.slice(middleIndex + 1, rightIndex + 1);

    let leftCursor = 0;
    let rightCursor = 0;
    let target = leftIndex;
    const isFinalMerge = leftIndex === 0 && rightIndex === values.length - 1;

    while (leftCursor < left.length && rightCursor < right.length) {
      const leftSource = leftIndex + leftCursor;
      const rightSource = middleIndex + 1 + rightCursor;

      steps.push({
        values: [...values],
        comparing: [leftSource, rightSource],
        sorted: [...sorted],
      });

      if (left[leftCursor] <= right[rightCursor]) {
        values[target] = left[leftCursor];
        steps.push({
          values: [...values],
          swapping: [target, leftSource],
          sorted: [...sorted],
        });
        leftCursor += 1;
      } else {
        values[target] = right[rightCursor];
        steps.push({
          values: [...values],
          swapping: [target, rightSource],
          sorted: [...sorted],
        });
        rightCursor += 1;
      }

      target += 1;
    }

    while (leftCursor < left.length) {
      const leftSource = leftIndex + leftCursor;
      values[target] = left[leftCursor];
      steps.push({
        values: [...values],
        swapping: [target, leftSource],
        sorted: [...sorted],
      });
      leftCursor += 1;
      target += 1;
    }

    while (rightCursor < right.length) {
      const rightSource = middleIndex + 1 + rightCursor;
      values[target] = right[rightCursor];
      steps.push({
        values: [...values],
        swapping: [target, rightSource],
        sorted: [...sorted],
      });
      rightCursor += 1;
      target += 1;
    }

    if (isFinalMerge) {
      for (let index = leftIndex; index <= rightIndex; index += 1) {
        sorted.add(index);
      }
    }

    steps.push({ values: [...values], sorted: [...sorted] });
  }

  function sort(leftIndex: number, rightIndex: number) {
    if (leftIndex >= rightIndex) {
      return;
    }

    const middleIndex = Math.floor((leftIndex + rightIndex) / 2);
    sort(leftIndex, middleIndex);
    sort(middleIndex + 1, rightIndex);
    merge(leftIndex, middleIndex, rightIndex);
  }

  sort(0, values.length - 1);
  return steps;
}

export function insertionSortSteps(input: number[]): SortStep[] {
  const values = [...input];
  const steps: SortStep[] = [{ values: [...values], sorted: [] }];
  const sorted = new Set<number>();

  if (values.length === 0) {
    return steps;
  }

  sorted.add(0);
  steps.push({ values: [...values], sorted: [...sorted] });

  for (let index = 1; index < values.length; index += 1) {
    const key = values[index];
    let cursor = index - 1;

    steps.push({ values: [...values], comparing: [index, cursor], sorted: [...sorted] });

    while (cursor >= 0 && values[cursor] > key) {
      steps.push({ values: [...values], comparing: [cursor, cursor + 1], sorted: [...sorted] });
      values[cursor + 1] = values[cursor];
      steps.push({ values: [...values], swapping: [cursor, cursor + 1], sorted: [...sorted] });
      cursor -= 1;
    }

    values[cursor + 1] = key;
    steps.push({ values: [...values], swapping: [cursor + 1, index], sorted: [...sorted] });

    for (let sortedIndex = 0; sortedIndex <= index; sortedIndex += 1) {
      sorted.add(sortedIndex);
    }

    steps.push({ values: [...values], sorted: [...sorted] });
  }

  return steps;
}
