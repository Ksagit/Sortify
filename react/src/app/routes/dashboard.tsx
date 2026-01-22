import { Pause, Play, RotateCcw, Shuffle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { SortingProgressChart } from "src/components/dashboard/SortingProgressChart";
import { Button } from "src/components/ui/button";
import {
	Card,
	CardAction,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "src/components/ui/card";
import {
	useBubbleSort,
	useHeapSort,
	useMergeSort,
	useQuickSort,
} from "src/hooks/useSorting";

export function meta() {
	return [
		{ title: "Sortify - Dashboard" },
		{
			name: "description",
			content:
				"Visualize and understand sorting algorithms with interactive animations. Learn bubble sort, merge sort, quick sort and more!",
		},
	];
}

const SPEED_MIN = 50;
const SPEED_MAX = 600;

export default function Home() {
	const bubble = useBubbleSort({ size: 32, min: 10, max: 120, autoplay: true });
	const quick = useQuickSort({ size: 32, min: 10, max: 120, autoplay: true });
	const merge = useMergeSort({ size: 32, min: 10, max: 120, autoplay: true });
	const heap = useHeapSort({ size: 32, min: 10, max: 120, autoplay: true });

	const [isPlaying, setIsPlaying] = useState(true);
	const [delay, setDelay] = useState(200);

	const sliderValue = useMemo(() => SPEED_MIN + SPEED_MAX - delay, [delay]);

	const algorithms = [
		{
			name: "Bubble Sort",
			data: bubble,
			accent: "from-amber-500/70 via-amber-500/20 to-transparent",
		},
		{
			name: "Quick Sort",
			data: quick,
			accent: "from-sky-500/70 via-sky-500/20 to-transparent",
		},
		{
			name: "Merge Sort",
			data: merge,
			accent: "from-emerald-500/70 via-emerald-500/20 to-transparent",
		},
		{
			name: "Heap Sort",
			data: heap,
			accent: "from-purple-500/70 via-purple-500/20 to-transparent",
		},
	] as const;

	useEffect(() => {
		if (isPlaying) {
			bubble.play();
			quick.play();
			merge.play();
			heap.play();
		} else {
			bubble.pause();
			quick.pause();
			merge.pause();
			heap.pause();
		}
	}, [isPlaying, bubble, quick, merge, heap]);

	useEffect(() => {
		if (!isPlaying) return;
		if (bubble.isDone && quick.isDone && merge.isDone && heap.isDone) {
			setIsPlaying(false);
			return;
		}

		const id = window.setInterval(
			() => {
				bubble.next();
				quick.next();
				merge.next();
				heap.next();
			},
			Math.max(SPEED_MIN, delay),
		);

		return () => window.clearInterval(id);
	}, [isPlaying, delay, bubble, quick, merge, heap]);

	function restart() {
		bubble.restart();
		quick.restart();
		merge.restart();
		heap.restart();
	}

	function shuffle() {
		bubble.shuffle();
		quick.shuffle();
		merge.shuffle();
		heap.shuffle();
	}

	return (
		<div className="relative h-screen overflow-hidden bg-gradient-to-br from-muted to-background">
			<div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col px-4 py-6 sm:px-6 lg:px-8">
				<header className="mb-4 text-center md:text-left">
					<h1 className="mt-2 font-semibold text-3xl text-foreground sm:text-4xl">
						Visualize{" "}
						<span className="bg-gradient-to-r from-primary via-sky-500 to-purple-500 bg-clip-text text-transparent">
							Sorting Algorithms
						</span>
					</h1>
					<p className="mt-2 text-muted-foreground text-sm md:max-w-xl">
						Compare four classic strategies side-by-side. Adjust the speed,
						shuffle the data, and watch how each algorithm organizes the same
						array in real time.
					</p>
				</header>

				<Card className="border-border/60 bg-background/80 shadow-lg backdrop-blur">
					<CardContent className="flex flex-col gap-4 p-4 sm:p-5">
						<div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
							<div className="flex flex-wrap gap-2">
								<Button onClick={() => setIsPlaying((prev) => !prev)}>
									{isPlaying ? (
										<Pause className="mr-1.5" />
									) : (
										<Play className="mr-1.5" />
									)}{" "}
									{isPlaying ? "Pause" : "Play"}
								</Button>
								<Button variant="outline" onClick={restart}>
									<RotateCcw className="mr-1.5" /> Restart
								</Button>
								<Button variant="outline" onClick={shuffle}>
									<Shuffle className="mr-1.5" /> Shuffle
								</Button>
							</div>
							<div className="flex items-center gap-2">
								<span className="text-muted-foreground text-xs">Speed</span>
								<input
									type="range"
									min={SPEED_MIN}
									max={SPEED_MAX}
									step={10}
									value={sliderValue}
									onChange={(event) => {
										const value = Number(event.target.value);
										const nextDelay = SPEED_MIN + SPEED_MAX - value;
										setDelay(nextDelay);
										bubble.setSpeed(nextDelay);
										quick.setSpeed(nextDelay);
										merge.setSpeed(nextDelay);
										heap.setSpeed(nextDelay);
									}}
									className="h-1.5 w-40 cursor-pointer appearance-none rounded bg-muted accent-primary"
								/>
								<span className="text-[10px] text-muted-foreground tabular-nums">
									{delay} ms
								</span>
							</div>
						</div>

						<div className="grid gap-2 text-xs sm:grid-cols-2 lg:grid-cols-4">
							{algorithms.map(({ name, data }) => {
								const status = data.isDone
									? "Completed"
									: data.isPlaying
										? "Sorting"
										: "Paused";
								const badgeClasses = data.isDone
									? "bg-emerald-500/15 text-emerald-400"
									: data.isPlaying
										? "bg-primary/15 text-primary"
										: "bg-amber-500/15 text-amber-500";

								return (
									<div
										key={name}
										className="flex items-center justify-between rounded-md border border-border/60 bg-background/60 px-3 py-2"
									>
										<span className="font-medium text-foreground">{name}</span>
										<span
											className={`flex items-center gap-1 rounded-full px-2 py-1 ${badgeClasses}`}
										>
											<span
												className={`size-1.5 rounded-full bg-current ${
													data.isDone ? "" : "animate-pulse"
												}`}
											/>
											{status}
										</span>
									</div>
								);
							})}
						</div>
					</CardContent>
				</Card>

				<div className="grid flex-1 grid-cols-1 gap-4 overflow-hidden pt-2 lg:grid-cols-2">
					{algorithms.map(({ name, data, accent }) => {
						const status = data.isDone
							? "Completed"
							: data.isPlaying
								? "Sorting"
								: "Paused";
						const statusColor = data.isDone
							? "text-emerald-400"
							: data.isPlaying
								? "text-primary"
								: "text-amber-500";
						const dotColor = data.isDone
							? "bg-emerald-400"
							: data.isPlaying
								? "bg-primary"
								: "bg-amber-500";

						return (
							<Card
								key={name}
								className="relative overflow-hidden border-border/60 bg-background/80 shadow-lg backdrop-blur"
							>
								<div
									className={`pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${accent}`}
								/>
								<CardHeader className="border-border/60 border-b py-2">
									<CardTitle className="text-base">{name}</CardTitle>
									<CardAction className="text-muted-foreground text-xs">
										Step {data.index + 1}/{Math.max(data.steps.length, 1)}
									</CardAction>
								</CardHeader>
								<CardContent className="pt-4">
									<SortingProgressChart
										title=""
										progress={data.step}
										compareColor="#f59e0b"
										swapColor="#ef4444"
										sortedColor="#10b981"
										pivotColor="#3b82f6"
										height={160}
									/>
								</CardContent>
								<CardFooter className="border-border/60 border-t py-2">
									<div className="flex w-full items-center justify-between text-muted-foreground text-xs">
										<span>n = {data.step.values.length}</span>
										<span className={`flex items-center gap-1 ${statusColor}`}>
											<span
												className={`size-1.5 rounded-full ${dotColor} ${
													data.isDone ? "" : "animate-pulse"
												}`}
											/>
											{status}
										</span>
									</div>
								</CardFooter>
							</Card>
						);
					})}
				</div>
			</div>
		</div>
	);
}
