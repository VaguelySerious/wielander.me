import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "@/components/site/SiteHeader";
import { Playground } from "./Playground";
import s from "./quarks.module.css";

export const metadata: Metadata = {
	title: "QuarksJS Playground | Peter's blog",
	description:
		"Interactive playground for QuarksJS, a tiny canvas library for orbiting, connected points.",
};

export default function QuarksPage() {
	return (
		<>
			<SiteHeader compact />
			<main className={s.wrap}>
				<h1 className={s.title}>QuarksJS Playground</h1>
				<p className={s.intro}>
					A dependency-free canvas library: points orbit small circles, and
					nearby points are joined by lines that fade with distance.{" "}
					<a
						className="hl"
						href="https://github.com/VaguelySerious/quarksjs"
						target="_blank"
						rel="noopener"
					>
						Source on GitHub
					</a>
					.
				</p>
				<Playground />
			</main>
			<SiteFooter />
		</>
	);
}
