import { Geist, Geist_Mono } from "next/font/google";
import { BioLead, BioWork } from "@/components/designs/Bio";
import { DotField } from "@/components/designs/DotField";
import { getEntries, socials } from "@/components/designs/data";
import { SmartLink } from "@/components/designs/EntryLink";
import { MailLink } from "@/components/MailLink";
import s from "./signal.module.css";

const sans = Geist({ subsets: ["latin"], variable: "--sans" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--mono" });

export default async function SignalDesign() {
	const entries = await getEntries();

	return (
		<div className={`${s.root} ${sans.variable} ${mono.variable}`}>
			<DotField className={s.field} />
			<div className={s.layout}>
				<aside className={s.side}>
					<div className={s.status}>
						<span className={s.dot} /> Software Engineer · Vercel
					</div>
					<h1>Peter Wielander</h1>
					<p className={s.lead}>
						<BioLead />
					</p>
					<p className={s.sub}>
						<BioWork />
					</p>
					<ul className={s.socials}>
						<li>
							<a href={socials.github} target="_blank" rel="noopener">
								GitHub <span>↗</span>
							</a>
						</li>
						<li>
							<a href={socials.linkedin} target="_blank" rel="noopener">
								LinkedIn <span>↗</span>
							</a>
						</li>
						<li>
							<MailLink>
								Email <span>↗</span>
							</MailLink>
						</li>
					</ul>
				</aside>

				<main className={s.main}>
					<div className={s.listHead}>
						<span>Index</span>
						<span>{entries.length} entries</span>
					</div>
					<ul className={s.list}>
						{entries.map((e) => (
							<li key={e.id}>
								<SmartLink
									href={e.primaryHref}
									external={e.primaryExternal}
									className={s.item}
								>
									<div className={s.itemTop}>
										<span className={s.title}>{e.title}</span>
										<span className={s.arrow}>→</span>
									</div>
									<span
										className={s.desc}
										dangerouslySetInnerHTML={{ __html: e.description }}
									/>
									<div className={s.tags}>
										<span>{e.kind === "writing" ? "Essay" : "Project"}</span>
										<span>{e.dateLabel}</span>
										{e.code && <span>Open source</span>}
									</div>
								</SmartLink>
							</li>
						))}
					</ul>
					<footer className={s.footer}>
						© {new Date().getFullYear()} Peter Wielander
					</footer>
				</main>
			</div>
		</div>
	);
}
