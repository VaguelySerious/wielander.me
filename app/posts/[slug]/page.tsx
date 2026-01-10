import { marked } from "marked";
import readingTime from "reading-time";
import Link from "next/link";
import { Icon } from "@/components/Icon";
import { getAllPostSlugs, getPostBySlug } from "@/lib/contentful";
import type { Metadata } from "next";

export async function generateStaticParams() {
	const slugs = await getAllPostSlugs();
	return slugs.map((slug) => ({ slug }));
}

async function getPost(slug: string) {
	const post = await getPostBySlug(slug);

	if (!post) {
		return null;
	}

	const bodyText = String(post.fields.body || "");
	const body = marked(bodyText);
	const stats = readingTime(bodyText);

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
