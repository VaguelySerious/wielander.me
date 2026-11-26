import { Geist, Geist_Mono } from "next/font/google";
import { MailLink } from "@/components/MailLink";
import { BioLead, BioWork } from "./Bio";
import { getEntries, type SiteEntry, socials } from "./data";
import { SmartLink } from "./EntryLink";
import { type ClickMode, QuarkField } from "./QuarkField";
import s from "./quarks.module.css";

const sans = Geist({ subsets: ["latin"], variable: "--sans" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--mono" });

export type Variant = {
	/** CSS modifier class in quarks.module.css */
	theme: "base" | "a1" | "a2" | "a3" | "a4" | "a5";
	field: {
		click: ClickMode | ClickMode[];
		spawnCount?: number;
		accent?: string;
		gradient?: [string, string];
		hoverHeat?: boolean;
		lineAlpha?: number;
	};
	list: "plain" | "labels" | "glyphs" | "filter" | "cards" | "cardsDated";
	hint?: string;
};

const kindLabel = (e: SiteEntry) =>
	e.kind === "writing" ? "Essay" : "Project";

function Glyph({ kind }: { kind: SiteEntry["kind"] }) {
	return kind === "writing" ? (
		<svg viewBox="0 0 16 16" className={s.glyph} aria-hidden="true">
			<path
				d="M4 2.5h5.5L12.5 5.5V13.5H4z M9.5 2.5V5.5H12.5 M6 8.5h4.5 M6 10.75h4.5"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.1"
				strokeLinejoin="round"
			/>
		</svg>
	) : (
		<svg viewBox="0 0 16 16" className={s.glyph} aria-hidden="true">
			<path
				d="M8 2 13.5 5v6L8 14 2.5 11V5z M2.5 5 8 8l5.5-3 M8 8v6"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.1"
				strokeLinejoin="round"
			/>
		</svg>
	);
}

function Row({ e, v }: { e: SiteEntry; v: Variant }) {
	const external = e.kind === "project" && e.primaryExternal;
	const secondary = [
		e.read && e.visit
			? { label: "Visit", href: e.visit.href, ext: !e.visit.internal }
			: null,
		e.code && e.primaryHref !== e.code
			? { label: "Source", href: e.code, ext: true }
			: null,
	].filter(Boolean) as { label: string; href: string; ext: boolean }[];

	return (
		<li data-kind={e.kind} className={`${s.item} ${s[e.kind]}`}>
			{v.list === "cardsDated" ? (
				<div className={s.meta}>
					<time className={s.date} dateTime={e.date}>
						{e.dateLabel}
					</time>
					<span className={s.kindSub}>{kindLabel(e)}</span>
				</div>
			) : (
				<time className={s.date} dateTime={e.date}>
					{e.dateLabel}
				</time>
			)}
			<div className={s.body}>
				<div className={s.titleLine}>
					{v.list === "glyphs" && <Glyph kind={e.kind} />}
					{v.list === "cards" && <span className={s.kindDot} />}
					<SmartLink
						href={e.primaryHref}
						external={e.primaryExternal}
						className={s.title}
					>
						{e.title}
						{external && <span className={s.ext}> ↗</span>}
					</SmartLink>
				</div>
				<span
					className={s.desc}
					dangerouslySetInnerHTML={{ __html: e.description }}
				/>
				{secondary.length > 0 && v.list !== "plain" && (
					<span className={s.secondary}>
						{secondary.map((l) => (
							<SmartLink key={l.label} href={l.href} external={l.ext}>
								{l.label} ↗
							</SmartLink>
						))}
					</span>
				)}
			</div>
			{(v.list === "labels" || v.list === "filter" || v.list === "cards") && (
				<span className={s.kind}>{kindLabel(e)}</span>
			)}
		</li>
	);
}

export async function QuarksPage({ variant: v }: { variant: Variant }) {
	const entries = await getEntries();
	const counts = {
		all: entries.length,
		writing: entries.filter((e) => e.kind === "writing").length,
		project: entries.filter((e) => e.kind === "project").length,
	};

	return (
		<div
			className={`${s.root} ${s[v.theme]} ${sans.variable} ${mono.variable}`}
		>
			<header className={s.hero}>
				<QuarkField
					className={s.field}
					color="24,24,27"
					lineAlpha={0.55}
					density={1.2}
					{...v.field}
				/>
				<div className={s.wrap}>
					<nav className={s.topbar}>
						<span className={s.mark}>wielander.me</span>
						<ul>
							<li>
								<a href={socials.github} target="_blank" rel="noopener">
									GitHub
								</a>
							</li>
							<li>
								<a href={socials.linkedin} target="_blank" rel="noopener">
									LinkedIn
								</a>
							</li>
							<li>
								<MailLink>Email</MailLink>
							</li>
						</ul>
					</nav>
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
				</div>
				{v.hint && <p className={s.hint}>{v.hint}</p>}
			</header>

			<main className={s.wrap}>
				<section className={`${s.section} ${s[`list_${v.list}`]}`}>
					{v.list === "filter" ? (
						<fieldset className={s.filters}>
							<legend className={s.srOnly}>Filter entries</legend>
							{(
								[
									["all", "All"],
									["writing", "Writing"],
									["project", "Projects"],
								] as const
							).map(([value, label]) => (
								<label key={value}>
									<input
										type="radio"
										name="kind"
										value={value}
										defaultChecked={value === "all"}
									/>
									<span>
										{label} <em>{counts[value]}</em>
									</span>
								</label>
							))}
						</fieldset>
					) : (
						<h2 className={s.label}>Writing &amp; projects</h2>
					)}
					<ul className={s.list}>
						{entries.map((e) => (
							<Row key={e.id} e={e} v={v} />
						))}
					</ul>
				</section>
			</main>

			<footer className={`${s.wrap} ${s.footer}`}>
				<span>© {new Date().getFullYear()} Peter Wielander</span>
				<span>
					Background: <a href="/quarks">QuarksJS</a>
				</span>
			</footer>
		</div>
	);
}
