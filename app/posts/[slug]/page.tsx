import { marked } from "marked";
import readingTime from "reading-time";
import Link from "next/link";
import { Icon } from "@/components/Icon";
import { createClient } from "@/lib/contentful";
import { BlogPost } from "@/lib/types";
import type { Metadata } from "next";

const client = createClient();

export async function generateStaticParams() {
	try {
		const posts = await client.getEntries({
			content_type: "blogPost",
		} as any);

		return posts.items.map((post: any) => ({
			slug: post.fields.slug,
		}));
	} catch (error) {
		console.error("Error generating static params:", error);
		return [];
	}
}

async function getPost(slug: string) {
	try {
		const posts = await client.getEntries({
			content_type: "blogPost",
			"fields.slug": slug,
		} as any);

		const post = posts.items[0];
		if (!post) {
			return null;
		}

		const fields = post.fields as any;
		const body = marked(String(fields.body || ""));
		const stats = readingTime(String(fields.body || ""));

		return { post, body, stats };
	} catch (error) {
		console.error("Error fetching post:", error);
		return null;
	}
}

export async function generateMetadata({
	params,
}: {
	params: Promise<{ slug: string }>;
}): Promise<Metadata> {
	const { slug } = await params;
	const data = await getPost(slug);

	if (!data) {
		return {
			title: "Post Not Found",
		};
	}

	const { post } = data;
	const fields = post.fields as any;
	const title = fields.title + " | Peter's blog";

	return {
		title,
		description: fields.description,
		openGraph: {
			title,
			description: fields.description,
		},
		twitter: {
			card: "summary_large_image",
			title,
			description: fields.description,
		},
	};
}

export default async function PostPage({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const { slug } = await params;
	const data = await getPost(slug);

	if (!data) {
		return <div>Post not found</div>;
	}

	const { post, body, stats } = data;
	const fields = post.fields as any;

	return (
		<div className="post">
			<Link href="/" className="post-controls">
				<Icon name="arrow-left" /> <span>All Posts &amp; Projects</span>
			</Link>
			<h1 className="post-title">{fields.title}</h1>
			<div className="post-header">
				<div className="post-date">
					{new Date(fields.publishDate).toDateString().slice(4)}
				</div>
				<div className="post-length">{stats.text}</div>
			</div>
			<div className="container">
				<div
					className="body"
					dangerouslySetInnerHTML={{ __html: body as string }}
				/>
			</div>
		</div>
	);
}
