import { QuarksPage } from "@/components/designs/QuarksPage";

// Pulse · indigo accent · type labels
export default function Page() {
	return (
		<QuarksPage
			variant={{
				theme: "a1",
				field: { click: "pulse", accent: "79,70,229", hoverHeat: true },
				list: "labels",
				hint: "Click anywhere up here",
			}}
		/>
	);
}
