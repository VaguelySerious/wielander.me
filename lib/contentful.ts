import * as contentful from "contentful";
import type { Entry } from "contentful";
import { BlogPost } from "./types";

const config = {
	space: process.env.CTF_SPACE_ID || "tx3oybxuzvav",
	accessToken: process.env.CTF_CDA_ACCESS_TOKEN || "",
};

export function createClient(): contentful.ContentfulClientApi<undefined> {
	if (!config.accessToken) {
		console.warn("Contentful access token not found, using mock client");
		return {
			getEntries: async () => ({ items: [] }),
		} as any;
	}
	return contentful.createClient(config);
}

const client = createClient();

/**
 * Fetch all blog posts, ordered by creation date
 */
export async function getAllPosts(): Promise<Entry<BlogPost>[]> {
	try {
		const posts = await client.getEntries<BlogPost>({
			content_type: "blogPost",
			order: ["-sys.createdAt"],
		});
		return posts.items;
	} catch (error) {
		console.error("Error fetching posts:", error);
		return [];
	}
}

/**
 * Fetch a single blog post by slug
 */
export async function getPostBySlug(
	slug: string,
): Promise<Entry<BlogPost, "WITHOUT_UNRESOLVABLE_LINKS"> | null> {
	try {
		const posts = await client.getEntries<BlogPost>({
			content_type: "blogPost",
			"fields.slug[match]": slug,
			limit: 1,
		} as any);
		return (
			(posts.items[0] as Entry<BlogPost, "WITHOUT_UNRESOLVABLE_LINKS">) || null
		);
	} catch (error) {
		console.error(`Error fetching post with slug ${slug}:`, error);
		return null;
	}
}

/**
 * Fetch all post slugs for static generation
 */
export async function getAllPostSlugs(): Promise<string[]> {
	try {
		const posts = await client.getEntries<BlogPost>({
			content_type: "blogPost",
			select: ["fields.slug"] as any,
		});
		return posts.items
			.map((post) => post.fields.slug)
			.filter((slug) => Boolean(slug)) as string[];
	} catch (error) {
		console.error("Error fetching post slugs:", error);
		return [];
	}
}
