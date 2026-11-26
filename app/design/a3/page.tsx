import { QuarksPage } from "@/components/designs/QuarksPage";

// Gravity · teal→violet gradient · filter tabs
export default function Page() {
	return (
		<QuarksPage
			variant={{
				theme: "a3",
				field: {
					click: "gravity",
					gradient: ["13,148,136", "124,58,237"],
					lineAlpha: 0.75,
				},
				list: "filter",
				hint: "Press and hold",
			}}
		/>
	);
}
