import { Entry } from "contentful";
import { Item } from "../components/Item";
import { createClient } from "../lib/contentful";
import { BlogPost } from "../lib/types";

const client = createClient();

async function getPosts() {
	const posts = await client.getEntries<BlogPost>({
		content_type: process.env.CTF_BLOG_POST_TYPE_ID!,
		order: ["-fields.publishDate"],
	});

	return posts.items as Entry<BlogPost>[];
}

export default async function Home() {
	const posts = await getPosts();

	return (
		<div className="container">
			<div>
				<ul className="project-container">
					{posts.map((post) => (
						<li key={post.sys.id}>
							<Item project={post} />
						</li>
					))}
				</ul>
			</div>
		</div>
	);
}
