import { SortingProgressChart } from "src/components/dashboard/SortingProgressChart";
import { AlgorithmCards } from "src/components/landing-page/AlgorithmCards";
import { FeaturesSection } from "src/components/landing-page/FeaturesSection";
import { HeroSection } from "src/components/landing-page/HeroSection";
import {
	Card,
	CardAction,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "src/components/ui/card";
import { useQuickSort } from "src/hooks/useSorting";

export function meta() {
	return [
		{ title: "Sortify - Landing Page" },
		{
			name: "description",
			content:
				"Visualize and understand sorting algorithms with interactive animations. Learn bubble sort, merge sort, quick sort and more!",
		},
	];
}

export default function LandingPage() {
	const quick = useQuickSort({
		size: 28,
		min: 10,
		max: 120,
		autoplay: true,
		speed: 180,
	});

	return (
		<div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-muted to-background pb-10">
			<HeroSection />
			<div className="relative z-10 px-6">
				<div className="mx-auto max-w-7xl">
					<AlgorithmCards />
					<div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
						<FeaturesSection />
						<Card>
							<CardHeader className="border-b py-2">
								<CardTitle className="text-base">Quick Sort</CardTitle>
								<CardAction className="text-muted-foreground text-xs">
									Step {quick.index + 1}/{Math.max(quick.steps.length, 1)}
								</CardAction>
							</CardHeader>
							<CardContent>
								<SortingProgressChart
									title=""
									progress={quick.step}
									compareColor="#f59e0b"
									swapColor="#ef4444"
									sortedColor="#10b981"
									pivotColor="#3b82f6"
									height={160}
								/>
							</CardContent>
							<CardFooter className="border-t py-2">
								<div className="text-muted-foreground text-xs">
									n = {quick.step.values.length}
								</div>
							</CardFooter>
						</Card>
					</div>
				</div>
			</div>
		</div>
	);
}
