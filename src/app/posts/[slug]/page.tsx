import { Entry } from "contentful";
import { marked } from "marked";
import readingTime from "reading-time";
import Link from "next/link";
import { Icon } from "../../../components/Icon";
import { createClient } from "../../../lib/contentful";
import { BlogPost } from "../../../lib/types";
import type { Metadata } from "next";

const client = createClient();

async function getPost(slug: string) {
	const posts = await client.getEntries<BlogPost>({
		content_type: process.env.CTF_BLOG_POST_TYPE_ID!,
		"fields.slug": slug,
	});

	const post = posts.items[0];
	if (!post) {
		return null;
	}

	const body = marked(post.fields.body || "");
	const stats = readingTime(post.fields.body || "");

	return { post, body, stats };
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
	const title = post.fields.title + " | Peter's blog";

	return {
		title,
		description: post.fields.description,
		openGraph: {
			title,
			description: post.fields.description,
		},
		twitter: {
			card: "summary_large_image",
			title,
			description: post.fields.description,
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

	return (
		<div className="post">
			<Link href="/" className="post-controls">
				<Icon name="arrow-left" /> <span>All Posts &amp; Projects</span>
			</Link>
			<h1 className="post-title">{post.fields.title}</h1>
			<div className="post-header">
				<div className="post-date">
					{new Date(post.fields.publishDate).toDateString().slice(4)}
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
