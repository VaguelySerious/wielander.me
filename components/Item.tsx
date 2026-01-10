import { Entry } from "contentful";
import Link from "next/link";
import { BlogPostFields } from "@/lib/types";

export function Item({ project }: { project: Entry<any> }) {
	const fields = project.fields as any;
	const eightHours = 8 * 1000 * 3600;
	const dateString = new Date(
		new Date(fields.publishDate).getTime() + eightHours,
	)
		.toDateString()
		.slice(4);
	const dateTime = fields.publishDate.slice(0, 10);

	// Check if projectUrl is on the main wielander.me domain (not subdomains)
	const isWielanderUrl =
		fields.projectUrl &&
		(fields.projectUrl.startsWith("/") ||
			fields.projectUrl.startsWith("wielander.me") ||
			fields.projectUrl.includes("://wielander.me/") ||
			fields.projectUrl.includes("://www.wielander.me/"));

	// Convert wielander.me URLs to relative paths
	const getRelativePath = (url: string) => {
		if (!url) return "";
		if (url.startsWith("/")) return url;
		try {
			const urlObj = new URL(url);
			// Only convert if it's exactly wielander.me or www.wielander.me (no subdomains)
			if (
				urlObj.hostname === "wielander.me" ||
				urlObj.hostname === "www.wielander.me"
			) {
				return urlObj.pathname + urlObj.search + urlObj.hash;
			}
		} catch (e) {
			// Invalid URL, return as-is
		}
		return url;
	};

	return (
		<article id={fields.slug} className="item">
			<span className="item-header">
				<span>
					{fields.projectUrl &&
						(isWielanderUrl ? (
							<Link
								href={getRelativePath(fields.projectUrl)}
								className="item-link -live"
							>
								Web
							</Link>
						) : (
							<a
								href={fields.projectUrl}
								className="item-link -live"
								target="_blank"
								rel="noopener noreferrer"
							>
								Web
							</a>
						))}
					{fields.body && (
						<Link href={`/posts/${fields.slug}`} className="item-link">
							Blog
						</Link>
					)}
					{fields.githubUrl && (
						<a
							href={fields.githubUrl}
							className="item-link -code"
							target="_blank"
							rel="noopener noreferrer"
						>
							Code
						</a>
					)}
					<span className="item-title">{fields.title}</span>
				</span>
				<span className="item-date">
					<time dateTime={dateTime}>{dateString}</time>
				</span>
			</span>
			<span
				className="item-description"
				dangerouslySetInnerHTML={{ __html: fields.description }}
			/>
		</article>
	);
}
