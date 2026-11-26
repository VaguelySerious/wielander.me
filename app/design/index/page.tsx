import { Inter_Tight, JetBrains_Mono } from "next/font/google";
import { Attractor } from "@/components/designs/Attractor";
import { BioLead, BioWork } from "@/components/designs/Bio";
import { getEntries, socials } from "@/components/designs/data";
import { SmartLink } from "@/components/designs/EntryLink";
import { MailLink } from "@/components/MailLink";
import s from "./index.module.css";

const sans = Inter_Tight({ subsets: ["latin"], variable: "--sans" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--mono" });

export default async function IndexDesign() {
	const entries = await getEntries();
	const total = entries.length;

	return (
		<div className={`${s.root} ${sans.variable} ${mono.variable}`}>
			<div className={s.wrap}>
				<nav className={s.nav}>
					<span>PW</span>
					<span className={s.navLinks}>
						<a href={socials.github} target="_blank" rel="noopener">
							GitHub
						</a>
						<a href={socials.linkedin} target="_blank" rel="noopener">
							LinkedIn
						</a>
						<MailLink>Email</MailLink>
					</span>
				</nav>

				<header className={s.hero}>
					<div className={s.heroText}>
						<h1>
							Peter
							<br />
							Wielander
						</h1>
						<p className={s.lead}>
							<BioLead />
						</p>
						<p className={s.sub}>
							<BioWork />
						</p>
					</div>
					<figure className={s.figure}>
						<Attractor className={s.canvas} captionClassName={s.caption} />
						<figcaption className={s.figLabel}>
							Fig. 1 — Clifford attractor, parameters drifting
						</figcaption>
					</figure>
				</header>

				<section>
					<div className={`${s.tableHead} ${s.cols}`}>
						<span>No.</span>
						<span>Title</span>
						<span className={s.hideSm}>Type</span>
						<span className={s.right}>Year</span>
					</div>
					<ol className={s.table}>
						{entries.map((e, i) => (
							<li key={e.id}>
								<SmartLink
									href={e.primaryHref}
									external={e.primaryExternal}
									className={`${s.row} ${s.cols}`}
								>
									<span className={s.num}>
										{String(total - i).padStart(2, "0")}
									</span>
									<span>
										<span className={s.title}>{e.title}</span>
										<span
											className={s.desc}
											dangerouslySetInnerHTML={{ __html: e.description }}
										/>
									</span>
									<span className={`${s.type} ${s.hideSm}`}>
										{e.kind === "writing" ? "Essay" : "Project"}
									</span>
									<span className={`${s.num} ${s.right}`}>{e.year}</span>
								</SmartLink>
							</li>
						))}
					</ol>
				</section>

				<footer className={s.footer}>
					<span>© {new Date().getFullYear()} Peter Wielander</span>
					<span>Set in Inter Tight &amp; JetBrains Mono</span>
				</footer>
			</div>
		</div>
	);
}
