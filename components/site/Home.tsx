import { BioLead, BioWork } from "./Bio";
import { getEntries, type SiteEntry } from "./data";
import s from "./home.module.css";
import { SiteFooter, SiteHeader } from "./SiteHeader";
import { SmartLink } from "./SmartLink";

function Entry({ e }: { e: SiteEntry }) {
	// Extra links beyond the primary one (which the whole row points to).
	const secondary = [
		e.read && e.visit
			? { label: "Visit", href: e.visit.href, ext: !e.visit.internal }
			: null,
		e.code && e.primaryHref !== e.code
			? { label: "Source", href: e.code, ext: true }
			: null,
	].filter((l) => l !== null);

	return (
		<li className={e.kind === "writing" ? `${s.item} ${s.writing}` : s.item}>
			<div className={s.meta}>
				<time dateTime={e.date}>{e.dateLabel}</time>
				<span className={s.kind}>
					{e.kind === "writing" ? "Essay" : "Project"}
				</span>
			</div>
			<div>
				<SmartLink
					href={e.primaryHref}
					external={e.primaryExternal}
					className={s.title}
				>
					{e.title}
					{e.kind === "project" && e.primaryExternal && (
						<span className={s.ext} aria-hidden="true">
							{" "}
							↗
						</span>
					)}
				</SmartLink>
				<span
					className={s.desc}
					// Descriptions are trusted HTML authored in Contentful.
					// biome-ignore lint/security/noDangerouslySetInnerHtml: trusted CMS content
					dangerouslySetInnerHTML={{ __html: e.description }}
				/>
				{secondary.length > 0 && (
					<span className={s.secondary}>
						{secondary.map((l) => (
							<SmartLink key={l.label} href={l.href} external={l.ext}>
								{l.label} ↗
							</SmartLink>
						))}
					</span>
				)}
			</div>
		</li>
	);
}

export async function Home() {
	const entries = await getEntries();

	return (
		<>
			<SiteHeader>
				<div className={s.intro}>
					<h1>
						Peter Wielander<span className={s.period}>.</span>
					</h1>
					<p className={s.lead}>
						<BioLead />
					</p>
					<p className={s.sub}>
						<BioWork />
					</p>
				</div>
			</SiteHeader>
			<main className={s.wrap}>
				<h2 className={s.label}>Writing &amp; projects</h2>
				<ul className={s.list}>
					{entries.map((e) => (
						<Entry key={e.id} e={e} />
					))}
				</ul>
			</main>
			<SiteFooter />
		</>
	);
}
