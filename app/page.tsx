import { Item } from "@/components/Item";
import { getAllPosts } from "@/lib/contentful";

export default async function Home() {
	const posts = await getAllPosts();

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
