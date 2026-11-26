import { QuarksPage } from "@/components/designs/QuarksPage";

export default function Page() {
	return (
		<QuarksPage
			variant={{ theme: "base", field: { click: "none" }, list: "plain" }}
		/>
	);
}
