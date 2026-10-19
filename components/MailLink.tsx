"use client";

import { type ReactNode, useState } from "react";

// Stored reversed and split so the address never appears as a contiguous
// string in the served HTML or the JS bundle. The real mailto is only set on
// hover, focus or touch — interactions that crawlers don't perform.
const PARTS = ["rednaleiw.retep", "moc.liamg"];
const reverse = (s: string) => s.split("").reverse().join("");

export function MailLink({
	className,
	children,
}: {
	className?: string;
	children: ReactNode;
}) {
	const [href, setHref] = useState("#mail");
	const reveal = () => {
		const [user, domain] = PARTS.map(reverse);
		setHref(`mailto:${user}@${domain}`);
	};

	return (
		<a
			href={href}
			className={className}
			aria-label="My email address"
			onMouseEnter={reveal}
			onFocus={reveal}
			onTouchStart={reveal}
		>
			{children}
		</a>
	);
}
