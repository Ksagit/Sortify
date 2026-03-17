import { SortStep } from './sorting.models';

export function randomArray(size: number, min = 5, max = 100): number[] {
  return Array.from({ length: size }, () => Math.floor(Math.random() * (max - min + 1)) + min);
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
        sorted: [...sortedSet]
      });

      if (values[inner] > values[inner + 1]) {
        [values[inner], values[inner + 1]] = [values[inner + 1], values[inner]];
        swapped = true;

        steps.push({
          values: [...values],
          swapping: [inner, inner + 1],
          sorted: [...sortedSet]
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
        sorted: [...sorted]
      });

      if (values[cursor] < pivotValue) {
        if (partitionIndex !== cursor) {
          [values[partitionIndex], values[cursor]] = [values[cursor], values[partitionIndex]];
          steps.push({
            values: [...values],
            swapping: [partitionIndex, cursor],
            pivot: pivotIndex,
            sorted: [...sorted]
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
        sorted: [...sorted]
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
        sorted: [...sorted]
      });

      if (left[leftCursor] <= right[rightCursor]) {
        values[target] = left[leftCursor];
        steps.push({
          values: [...values],
          swapping: [target, leftSource],
          sorted: [...sorted]
        });
        leftCursor += 1;
      } else {
        values[target] = right[rightCursor];
        steps.push({
          values: [...values],
          swapping: [target, rightSource],
          sorted: [...sorted]
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
        sorted: [...sorted]
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
        sorted: [...sorted]
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

export function heapSortSteps(input: number[]): SortStep[] {
  const values = [...input];
  const steps: SortStep[] = [{ values: [...values], sorted: [] }];
  const sorted = new Set<number>();
  const length = values.length;

  function heapify(size: number, rootIndex: number) {
    let largest = rootIndex;
    const left = rootIndex * 2 + 1;
    const right = rootIndex * 2 + 2;

    if (left < size) {
      steps.push({
        values: [...values],
        comparing: [left, largest],
        sorted: [...sorted]
      });

      if (values[left] > values[largest]) {
        largest = left;
      }
    }

    if (right < size) {
      steps.push({
        values: [...values],
        comparing: [right, largest],
        sorted: [...sorted]
      });

      if (values[right] > values[largest]) {
        largest = right;
      }
    }

    if (largest !== rootIndex) {
      [values[rootIndex], values[largest]] = [values[largest], values[rootIndex]];
      steps.push({
        values: [...values],
        swapping: [rootIndex, largest],
        sorted: [...sorted]
      });
      heapify(size, largest);
    }
  }

  for (let index = Math.floor(length / 2) - 1; index >= 0; index -= 1) {
    heapify(length, index);
  }

  for (let end = length - 1; end > 0; end -= 1) {
    [values[0], values[end]] = [values[end], values[0]];
    steps.push({ values: [...values], swapping: [0, end], sorted: [...sorted] });
    sorted.add(end);
    steps.push({ values: [...values], sorted: [...sorted] });
    heapify(end, 0);
  }

  sorted.add(0);
  steps.push({ values: [...values], sorted: [...sorted] });
  return steps;
}