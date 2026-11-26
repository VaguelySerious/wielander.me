import Link from "next/link";
import type { ReactNode } from "react";

export function SmartLink({
	href,
	external,
	className,
	children,
	...rest
}: {
	href: string;
	external?: boolean;
	className?: string;
	children: ReactNode;
	"aria-label"?: string;
}) {
	const isExternal = external ?? /^https?:/.test(href);
	if (isExternal) {
		return (
			<a
				href={href}
				className={className}
				target="_blank"
				rel="noopener noreferrer"
				{...rest}
			>
				{children}
			</a>
		);
	}
	return (
		<Link href={href} className={className} {...rest}>
			{children}
		</Link>
	);
}
