import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const sans = Geist({ subsets: ["latin"], variable: "--font-sans" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" });

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
		<html lang="en" className={`${sans.variable} ${mono.variable}`}>
			<body>
				{children}
				<Analytics />
			</body>
		</html>
	);
}
