import { Entry } from "contentful";
import Link from "next/link";
import { BlogPost } from "../lib/types";

export function Item({ project }: { project: Entry<BlogPost> }) {
	const eightHours = 8 * 1000 * 3600;
	const dateString = new Date(
		new Date(project.fields.publishDate).getTime() + eightHours,
	)
		.toDateString()
		.slice(4);
	const dateTime = project.fields.publishDate.slice(0, 10);

	return (
		<article id={project.fields.slug} className="item">
			<span className="item-header">
				<span>
					{project.fields.projectUrl && (
						<a
							href={project.fields.projectUrl}
							className="item-link -live"
							target="_blank"
							rel="noopener noreferrer"
						>
							Web
						</a>
					)}
					{project.fields.body && (
						<Link href={`/posts/${project.fields.slug}`} className="item-link">
							Blog
						</Link>
					)}
					{project.fields.githubUrl && (
						<a
							href={project.fields.githubUrl}
							className="item-link -code"
							target="_blank"
							rel="noopener noreferrer"
						>
							Code
						</a>
					)}
					<span className="item-title">{project.fields.title}</span>
				</span>
				<span className="item-date">
					<time dateTime={dateTime}>{dateString}</time>
				</span>
			</span>
			<span
				className="item-description"
				dangerouslySetInnerHTML={{ __html: project.fields.description }}
			/>
		</article>
	);
}
