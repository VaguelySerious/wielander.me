import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";

const title = "Peter's Blog";
const description =
	"Peter Wielander's Blog. All about language learning, machine learning, tech, nature, exercise, and life lessons.";

export const metadata: Metadata = {
	title,
	description,
	openGraph: {
		title,
		description,
	},
	twitter: {
		card: "summary_large_image",
		title,
		description,
		creator: "@vaguelyserious",
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body>
				{children}
				<Analytics />
			</body>
		</html>
	);
}
