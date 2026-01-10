import { Item } from '@/components/Item';
import { createClient } from '@/lib/contentful';
import { BlogPost } from '@/lib/types';

const client = createClient();

async function getPosts() {
  try {
    const posts = await client.getEntries({
      content_type: 'blogPost',
      order: ['-sys.createdAt'] as any,
    });
    
    return posts.items;
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
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

