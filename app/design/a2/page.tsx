import { QuarksPage } from "@/components/designs/QuarksPage";

// Spawn · vermilion highlighter · glyphs
export default function Page() {
	return (
		<QuarksPage
			variant={{
				theme: "a2",
				field: { click: "spawn", accent: "234,88,12" },
				list: "glyphs",
				hint: "Click to add quarks",
			}}
		/>
	);
}
