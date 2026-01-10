import { EntrySkeletonType } from "contentful";

export interface BlogPostFields {
	title: string;
	slug: string;
	description: string;
	marked_description: string;
	body: string;
	publishDate: string;
	thumbImage?: string;
	heroImage?: string;
	tags?: string[];
	githubUrl?: string;
	projectUrl?: string;
}

export interface BlogPost extends EntrySkeletonType {
	contentTypeId: "blogPost";
	fields: BlogPostFields;
}
