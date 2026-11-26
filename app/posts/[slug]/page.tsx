import { marked } from "marked";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import readingTime from "reading-time";
import { SiteFooter, SiteHeader } from "@/components/site/SiteHeader";
import { getAllPostSlugs, getPostBySlug } from "@/lib/contentful";
import s from "./post.module.css";

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
	const body = await marked.parse(bodyText);
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
	const title = `${post.fields.title} | Peter's blog`;

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
		notFound();
	}

	const { post, body, stats } = data;
	const date = String(post.fields.publishDate).slice(0, 10);

	return (
		<>
			<SiteHeader compact />
			<main className={s.wrap}>
				<article>
					<Link href="/" className={s.back}>
						← Writing &amp; projects
					</Link>
					<h1 className={s.title}>{post.fields.title}</h1>
					<div className={s.meta}>
						<time dateTime={date}>
							{new Date(`${date}T12:00:00Z`).toLocaleDateString("en-US", {
								day: "numeric",
								month: "long",
								year: "numeric",
								timeZone: "UTC",
							})}
						</time>
						<span aria-hidden="true">·</span>
						<span>{stats.text}</span>
					</div>
					<div
						className={s.body}
						// Post bodies are trusted Markdown authored in Contentful.
						// biome-ignore lint/security/noDangerouslySetInnerHtml: trusted CMS content
						dangerouslySetInnerHTML={{ __html: body }}
					/>
				</article>
			</main>
			<SiteFooter />
		</>
	);
}
