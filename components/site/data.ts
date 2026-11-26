import { getAllPosts } from "@/lib/contentful";
import type { BlogPostFields } from "@/lib/types";

export type SiteEntry = {
	id: string;
	slug: string;
	title: string;
	description: string; // HTML
	date: string; // ISO yyyy-mm-dd
	year: number;
	dateLabel: string; // "Nov 2026"
	kind: "writing" | "project";
	read?: string; // internal blog path
	visit?: { href: string; internal: boolean };
	code?: string;
	primaryHref: string;
	primaryExternal: boolean;
};

function normalizeUrl(url: string): { href: string; internal: boolean } {
	if (url.startsWith("/")) return { href: url, internal: true };
	try {
		const u = new URL(url);
		if (u.hostname === "wielander.me" || u.hostname === "www.wielander.me") {
			return { href: u.pathname + u.search + u.hash, internal: true };
		}
	} catch {}
	return { href: url, internal: false };
}

export async function getEntries(): Promise<SiteEntry[]> {
	const posts = await getAllPosts();
	const entries = posts.map((post) => {
		const f = post.fields as unknown as BlogPostFields;
		const date = String(f.publishDate).slice(0, 10);
		const d = new Date(`${date}T12:00:00Z`);
		const visit = f.projectUrl ? normalizeUrl(f.projectUrl) : undefined;
		const read = f.body ? `/posts/${f.slug}` : undefined;
		const code = f.githubUrl || undefined;
		const primaryHref = read || visit?.href || code || "#";
		return {
			id: post.sys.id,
			slug: f.slug,
			title: f.title,
			description: f.description || "",
			date,
			year: d.getUTCFullYear(),
			dateLabel: d.toLocaleDateString("en-US", {
				month: "short",
				year: "numeric",
				timeZone: "UTC",
			}),
			kind: f.body ? "writing" : "project",
			read,
			visit,
			code,
			primaryHref,
			primaryExternal: !read && !(visit?.internal ?? false),
		} satisfies SiteEntry;
	});
	return entries.sort((a, b) => b.date.localeCompare(a.date));
}

export const socials = {
	github: "https://github.com/VaguelySerious",
	linkedin: "https://www.linkedin.com/in/peter-wielander/",
};
