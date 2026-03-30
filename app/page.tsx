import { Item } from "@/components/Item";
import { getAllPosts } from "@/lib/contentful";

export default async function Home() {
	const posts = await getAllPosts();

	return (
		<>
			<h2 className="header-subtitle">
				<p>
					I obsess about languages, education, software, AI, movement,
					self-improvement, economics, physics and frugality. Every month is a
					different project, every year a different lifetime.
				</p>
				<p>
					During work hours, I'm a Software Engineer at{" "}
					<a href="https://vercel.com/">Vercel</a>, a core contributor of{" "}
					<a href="https://useworkflow.dev/">Workflow SDK</a>, and author of{" "}
					<a href="https://useworkflow.dev/docs/ai">Building Durable Agents</a>.
					Previously, I was Staff Software Engineer and Tech Lead for{" "}
					<a href="https://www.minervaproject.com/">Minerva Project</a>'s
					emerging products, helping to make active-learning the norm in
					higher-ed classrooms.
				</p>
			</h2>
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
		</>
	);
}
