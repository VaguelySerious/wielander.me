"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const designs = [
	{ slug: "quarks", label: "A" },
	{ slug: "a1", label: "A1 · Pulse" },
	{ slug: "a2", label: "A2 · Spawn" },
	{ slug: "a3", label: "A3 · Gravity" },
	{ slug: "a4", label: "A4 · Ripple" },
	{ slug: "a5", label: "A5 · Combined" },
];

export function Switcher() {
	const path = usePathname();
	return (
		<nav
			style={{
				position: "fixed",
				bottom: 16,
				left: "50%",
				transform: "translateX(-50%)",
				zIndex: 100,
				display: "flex",
				gap: 4,
				padding: 4,
				borderRadius: 999,
				background: "rgba(20,20,22,0.88)",
				backdropFilter: "blur(8px)",
				boxShadow: "0 4px 24px rgba(0,0,0,0.2)",
				font: "500 12px/1 ui-sans-serif, system-ui, sans-serif",
			}}
		>
			{designs.map((d) => {
				const active = path === `/design/${d.slug}`;
				return (
					<Link
						key={d.slug}
						href={`/design/${d.slug}`}
						style={{
							padding: "8px 12px",
							borderRadius: 999,
							color: active ? "#111" : "#ddd",
							background: active ? "#fff" : "transparent",
							textDecoration: "none",
							whiteSpace: "nowrap",
						}}
					>
						{d.label}
					</Link>
				);
			})}
		</nav>
	);
}
