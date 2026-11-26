import { Geist_Mono, Instrument_Serif, Newsreader } from "next/font/google";
import { BioLead, BioWork } from "@/components/designs/Bio";
import { Contours } from "@/components/designs/Contours";
import { getEntries, groupByYear, socials } from "@/components/designs/data";
import { SmartLink } from "@/components/designs/EntryLink";
import { MailLink } from "@/components/MailLink";
import s from "./contour.module.css";

const display = Instrument_Serif({
	subsets: ["latin"],
	weight: "400",
	style: ["normal", "italic"],
	variable: "--display",
});
const serif = Newsreader({
	subsets: ["latin"],
	style: ["normal", "italic"],
	variable: "--serif",
});
const mono = Geist_Mono({ subsets: ["latin"], variable: "--mono" });

export default async function ContourDesign() {
	const entries = await getEntries();
	const writing = groupByYear(entries.filter((e) => e.kind === "writing"));
	const projects = entries.filter((e) => e.kind === "project");

	return (
		<div
			className={`${s.root} ${display.variable} ${serif.variable} ${mono.variable}`}
		>
			<Contours className={s.field} />
			<div className={s.wrap}>
				<header className={s.header}>
					<div className={s.meta}>
						<span>Peter Wielander</span>
						<span>
							<a href={socials.github} target="_blank" rel="noopener">
								GitHub
							</a>
							<a href={socials.linkedin} target="_blank" rel="noopener">
								LinkedIn
							</a>
							<MailLink>Email</MailLink>
						</span>
					</div>
					<h1>
						Peter <em>Wielander</em>
					</h1>
					<div className={s.bio}>
						<p className={s.lead}>
							<BioLead />
						</p>
						<p>
							<BioWork />
						</p>
					</div>
				</header>

				<section className={s.section}>
					<h2 className={s.label}>
						<span>Essays &amp; notes</span>
						<span>{entries.filter((e) => e.kind === "writing").length}</span>
					</h2>
					{writing.map(([year, items]) => (
						<div key={year} className={s.year}>
							<div className={s.yearLabel}>{year}</div>
							<ul>
								{items.map((e) => (
									<li key={e.id}>
										<SmartLink href={e.primaryHref} className={s.entry}>
											<span className={s.title}>{e.title}</span>
											<span
												className={s.desc}
												dangerouslySetInnerHTML={{ __html: e.description }}
											/>
										</SmartLink>
									</li>
								))}
							</ul>
						</div>
					))}
				</section>

				<section className={s.section}>
					<h2 className={s.label}>
						<span>Things I've made</span>
						<span>{projects.length}</span>
					</h2>
					<ul className={s.projects}>
						{projects.map((e) => (
							<li key={e.id} className={s.project}>
								<span className={s.pyear}>{e.year}</span>
								<div>
									<SmartLink
										href={e.primaryHref}
										external={e.primaryExternal}
										className={s.title}
									>
										{e.title}
									</SmartLink>
									<span
										className={s.desc}
										dangerouslySetInnerHTML={{ __html: e.description }}
									/>
								</div>
								<span className={s.plinks}>
									{e.visit && (
										<SmartLink href={e.visit.href} external={!e.visit.internal}>
											site
										</SmartLink>
									)}
									{e.code && <SmartLink href={e.code}>code</SmartLink>}
								</span>
							</li>
						))}
					</ul>
				</section>

				<footer className={s.footer}>
					<span>Peter Wielander · {new Date().getFullYear()}</span>
					<span>Contours drawn live from simplex noise</span>
				</footer>
			</div>
		</div>
	);
}
