import { useEffect, useRef, useState } from "react";

export type SortStep = {
	values: number[];
	comparing?: number[];
	swapping?: number[];
	pivot?: number | null;
	sorted?: number[];
};

export type UseSortingOptions = {
	size?: number;
	min?: number;
	max?: number;
	speed?: number; // ms per step
	autoplay?: boolean;
};

export type UseSortingResult = {
	// state
	step: SortStep;
	index: number;
	steps: SortStep[];
	isPlaying: boolean;
	isDone: boolean;
	speed: number;
	// controls
	play: () => void;
	pause: () => void;
	toggle: () => void;
	next: () => void;
	prev: () => void;
	setSpeed: (ms: number) => void;
	restart: () => void;
	shuffle: () => void;
};

export function randomArray(n: number, min = 5, max = 100): number[] {
	return Array.from(
		{ length: n },
		() => Math.floor(Math.random() * (max - min + 1)) + min,
	);
}

// --- Step generators ---
export function bubbleSortSteps(input: number[]): SortStep[] {
	const a = [...input];
	const n = a.length;
	const steps: SortStep[] = [{ values: [...a], sorted: [] }];
	const sortedSet = new Set<number>();

	for (let i = 0; i < n; i++) {
		let swapped = false;
		for (let j = 0; j < n - 1 - i; j++) {
			steps.push({
				values: [...a],
				comparing: [j, j + 1],
				sorted: [...sortedSet],
			});
			if (a[j] > a[j + 1]) {
				[a[j], a[j + 1]] = [a[j + 1], a[j]];
				swapped = true;
				steps.push({
					values: [...a],
					swapping: [j, j + 1],
					sorted: [...sortedSet],
				});
			}
		}
		sortedSet.add(n - 1 - i);
		steps.push({ values: [...a], sorted: [...sortedSet] });
		if (!swapped) break;
	}
	for (let k = 0; k < n; k++) sortedSet.add(k);
	steps.push({ values: [...a], sorted: [...sortedSet] });
	return steps;
}

export function quickSortSteps(input: number[]): SortStep[] {
	const a = [...input];
	const steps: SortStep[] = [{ values: [...a], sorted: [] }];
	const sorted = new Set<number>();
	const stack: { left: number; right: number }[] = [
		{ left: 0, right: a.length - 1 },
	];

	while (stack.length > 0) {
		const current = stack.pop();
		if (!current) continue;
		const { left, right } = current;
		if (left >= right) {
			if (left === right) {
				sorted.add(left);
				steps.push({ values: [...a], sorted: [...sorted] });
			}
			continue;
		}

		const pivotIndex = right;
		const pivotVal = a[pivotIndex];
		steps.push({ values: [...a], pivot: pivotIndex, sorted: [...sorted] });

		let i = left;
		for (let j = left; j < right; j++) {
			steps.push({
				values: [...a],
				comparing: [j, pivotIndex],
				pivot: pivotIndex,
				sorted: [...sorted],
			});
			if (a[j] < pivotVal) {
				if (i !== j) {
					[a[i], a[j]] = [a[j], a[i]];
					steps.push({
						values: [...a],
						swapping: [i, j],
						pivot: pivotIndex,
						sorted: [...sorted],
					});
				}
				i++;
			}
		}
		if (i !== pivotIndex) {
			[a[i], a[pivotIndex]] = [a[pivotIndex], a[i]];
			steps.push({
				values: [...a],
				swapping: [i, pivotIndex],
				sorted: [...sorted],
			});
		}
		sorted.add(i);
		steps.push({ values: [...a], sorted: [...sorted] });

		if (left < i - 1) stack.push({ left, right: i - 1 });
		if (i + 1 < right) stack.push({ left: i + 1, right });
	}

	if (sorted.size < a.length) {
		for (let idx = 0; idx < a.length; idx++) {
			sorted.add(idx);
		}
		steps.push({ values: [...a], sorted: [...sorted] });
	}
	return steps;
}

export function mergeSortSteps(input: number[]): SortStep[] {
	const a = [...input];
	const steps: SortStep[] = [{ values: [...a], sorted: [] }];
	const sorted = new Set<number>();

	function merge(l: number, m: number, r: number) {
		const left = a.slice(l, m + 1);
		const right = a.slice(m + 1, r + 1);

		let i = 0;
		let j = 0;
		let k = l;
		const isFinalMerge = l === 0 && r === a.length - 1;

		while (i < left.length && j < right.length) {
			const li = l + i;
			const rj = m + 1 + j;
			steps.push({
				values: [...a],
				comparing: [li, rj],
				sorted: [...sorted],
			});

			if (left[i] <= right[j]) {
				a[k] = left[i];
				steps.push({
					values: [...a],
					swapping: [k, li],
					sorted: [...sorted],
				});
				i++;
			} else {
				a[k] = right[j];
				steps.push({
					values: [...a],
					swapping: [k, rj],
					sorted: [...sorted],
				});
				j++;
			}
			k++;
		}

		while (i < left.length) {
			const li = l + i;
			a[k] = left[i];
			steps.push({
				values: [...a],
				swapping: [k, li],
				sorted: [...sorted],
			});
			i++;
			k++;
		}

		while (j < right.length) {
			const rj = m + 1 + j;
			a[k] = right[j];
			steps.push({
				values: [...a],
				swapping: [k, rj],
				sorted: [...sorted],
			});
			j++;
			k++;
		}

		if (isFinalMerge) {
			for (let idx = l; idx <= r; idx++) {
				sorted.add(idx);
			}
		}

		steps.push({ values: [...a], sorted: [...sorted] });
	}

	function sort(l: number, r: number) {
		if (l >= r) return;
		const m = Math.floor((l + r) / 2);
		sort(l, m);
		sort(m + 1, r);
		merge(l, m, r);
	}

	sort(0, a.length - 1);
	return steps;
}

export function heapSortSteps(input: number[]): SortStep[] {
	const a = [...input];
	const steps: SortStep[] = [{ values: [...a], sorted: [] }];
	const sorted = new Set<number>();
	const n = a.length;

	function heapify(size: number, i: number) {
		let largest = i;
		const left = 2 * i + 1;
		const right = 2 * i + 2;
		if (left < size) {
			steps.push({
				values: [...a],
				comparing: [left, largest],
				sorted: [...sorted],
			});
			if (a[left] > a[largest]) largest = left;
		}
		if (right < size) {
			steps.push({
				values: [...a],
				comparing: [right, largest],
				sorted: [...sorted],
			});
			if (a[right] > a[largest]) largest = right;
		}
		if (largest !== i) {
			[a[i], a[largest]] = [a[largest], a[i]];
			steps.push({
				values: [...a],
				swapping: [i, largest],
				sorted: [...sorted],
			});
			heapify(size, largest);
		}
	}

	for (let i = Math.floor(n / 2) - 1; i >= 0; i--) heapify(n, i);
	for (let end = n - 1; end > 0; end--) {
		[a[0], a[end]] = [a[end], a[0]];
		steps.push({ values: [...a], swapping: [0, end], sorted: [...sorted] });
		sorted.add(end);
		steps.push({ values: [...a], sorted: [...sorted] });
		heapify(end, 0);
	}
	sorted.add(0);
	steps.push({ values: [...a], sorted: [...sorted] });
	return steps;
}

// --- Hooks
export function useSorting(
	stepsFactory: (arr: number[]) => SortStep[],
	options: UseSortingOptions = {},
): UseSortingResult {
	const {
		size = 32,
		min = 10,
		max = 120,
		speed = 200,
		autoplay = true,
	} = options;

	const [array, setArray] = useState<number[]>(() =>
		randomArray(size, min, max),
	);
	const [steps, setSteps] = useState<SortStep[]>(() => stepsFactory(array));
	const [index, setIndex] = useState(0);
	const [isPlaying, setIsPlaying] = useState(autoplay);
	const [intervalMs, setIntervalMs] = useState(speed);
	const timer = useRef<number | null>(null);
	const lastIndex = Math.max(0, steps.length - 1);
	const isDone = index >= lastIndex && steps.length > 0;

	// recompute when base array changes
	useEffect(() => {
		setSteps(stepsFactory(array));
		setIndex(0);
	}, [array, stepsFactory]);

	// autoplay loop
	useEffect(() => {
		if (!isPlaying) return;
		if (!steps.length) return;

		timer.current = window.setInterval(
			() => {
				setIndex((i) => {
					if (i >= steps.length - 1) {
						// reached the end; stop autoplay and stay at last step
						setIsPlaying(false);
						return steps.length - 1;
					}
					return i + 1;
				});
			},
			Math.max(50, intervalMs),
		);

		return () => {
			if (timer.current) window.clearInterval(timer.current);
		};
	}, [isPlaying, intervalMs, steps.length]);

	// actions
	const play = () => setIsPlaying(true);
	const pause = () => setIsPlaying(false);
	const toggle = () => setIsPlaying((p) => !p);
	const next = () =>
		setIndex((i) => {
			if (!steps.length) return 0;
			if (i >= steps.length - 1) return steps.length - 1;
			return i + 1;
		});
	const prev = () =>
		setIndex((i) => {
			if (!steps.length) return 0;
			if (i <= 0) return 0;
			return i - 1;
		});
	const setSpeed = (ms: number) => setIntervalMs(ms);
	const restart = () => setIndex(0);
	const shuffle = () => setArray(randomArray(size, min, max));

	return {
		step: steps[index] || { values: [] },
		index,
		steps,
		isPlaying,
		isDone,
		speed: intervalMs,
		play,
		pause,
		toggle,
		next,
		prev,
		setSpeed,
		restart,
		shuffle,
	};
}

export function useBubbleSort(options?: UseSortingOptions) {
	return useSorting(bubbleSortSteps, options);
}
export function useQuickSort(options?: UseSortingOptions) {
	return useSorting(quickSortSteps, options);
}
export function useMergeSort(options?: UseSortingOptions) {
	return useSorting(mergeSortSteps, options);
}
export function useHeapSort(options?: UseSortingOptions) {
	return useSorting(heapSortSteps, options);
}
