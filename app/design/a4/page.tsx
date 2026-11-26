import { QuarksPage } from "@/components/designs/QuarksPage";

// Ripple · emerald, color-coded kinds · project cards in the timeline
export default function Page() {
	return (
		<QuarksPage
			variant={{
				theme: "a4",
				field: { click: "ripple", accent: "5,150,105" },
				list: "cards",
				hint: "Click to send a ripple",
			}}
		/>
	);
}
