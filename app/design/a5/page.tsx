import { QuarksPage } from "@/components/designs/QuarksPage";

// Spawn + pulse · A2 vermilion highlighter · A4 project cards, type under date
export default function Page() {
	return (
		<QuarksPage
			variant={{
				theme: "a5",
				field: { click: ["spawn", "pulse"], accent: "234,88,12" },
				list: "cardsDated",
				hint: "Click to add quarks",
			}}
		/>
	);
}
