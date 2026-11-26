import Link from "next/link";
import type { ReactNode } from "react";
import { MailLink } from "@/components/MailLink";
import { socials } from "./data";
import { QuarkField } from "./QuarkField";
import s from "./site.module.css";

export function SiteHeader({
	children,
	compact = false,
}: {
	children?: ReactNode;
	compact?: boolean;
}) {
	return (
		<header className={`${s.hero} ${compact ? s.compact : ""}`}>
			<QuarkField className={s.field} density={compact ? 1 : 1.2} />
			<div className={s.wrap}>
				<nav className={s.topbar}>
					<Link href="/" className={s.mark}>
						wielander.me
					</Link>
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
				{children}
			</div>
		</header>
	);
}

export function SiteFooter() {
	return (
		<footer className={`${s.wrap} ${s.footer}`}>
			<span>© {new Date().getFullYear()} Peter Wielander</span>
			<span>
				Background: <Link href="/quarks">QuarksJS</Link>
			</span>
		</footer>
	);
}
