import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/Icon";
import { Svgs } from "@/components/Svgs";
import { Analytics } from "@vercel/analytics/next";
import "@/styles/globals.sass";

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

const links = [
	{
		slug: "mail",
		name: "Mail",
		href: "mailto:peter.wielander@gmail.com",
		label: "My email address",
	},
	{
		slug: "github",
		name: "Github",
		href: "https://github.com/VaguelySerious",
		label: "My github profile",
	},
	{
		slug: "linkedin",
		name: "LinkedIn",
		href: "https://www.linkedin.com/in/peter-wielander/",
		label: "My LinkedIn account",
	},
];

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body>
				<div className="site">
					<Svgs />
					<Analytics />
					<div className="site-container">
						<header className="header">
							<ul className="header-nav">
								<li>
									<Link
										href="/"
										className="header-link"
										aria-label="My website"
									>
										<Icon name="globe" />
										<span>Web</span>
									</Link>
								</li>
								{links.map((link) => (
									<li key={link.href}>
										<a
											rel="noopener"
											href={link.href}
											className="header-link"
											target={
												link.href.startsWith("http") ? "_blank" : undefined
											}
											aria-label={link.label}
										>
											<Icon name={link.slug} />
											<span>{link.name}</span>
										</a>
									</li>
								))}
							</ul>
							<div>
								<Link className="header-title clickable" href="/">
									<h1>Peter Wielander</h1>
								</Link>
							</div>
						</header>

						{children}

						<footer className="footer">
							<ul className="footer-icons">
								<li>
									<Link
										href="/"
										className="footer-link"
										aria-label="My website"
									>
										<span className="hidden">Web</span>
										<Icon name="globe" />
									</Link>
								</li>
								{links.map((link) => (
									<li key={link.href}>
										<a
											rel="noopener"
											href={link.href}
											className="footer-link"
											target={
												link.href.startsWith("http") ? "_blank" : undefined
											}
											aria-label={link.label}
										>
											<span className="hidden">{link.name}</span>
											<Icon name={link.slug} />
										</a>
									</li>
								))}
							</ul>
						</footer>
					</div>
				</div>
			</body>
		</html>
	);
}
