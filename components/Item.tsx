import { Entry } from 'contentful';
import Link from 'next/link';
import { BlogPostFields } from '@/lib/types';

export function Item({ project }: { project: Entry<any> }) {
  const fields = project.fields as any;
  const eightHours = 8 * 1000 * 3600;
  const dateString = new Date(
    new Date(fields.publishDate).getTime() + eightHours
  )
    .toDateString()
    .slice(4);
  const dateTime = fields.publishDate.slice(0, 10);

  return (
    <article id={fields.slug} className="item">
      <span className="item-header">
        <span>
          {fields.projectUrl && (
            <a
              href={fields.projectUrl}
              className="item-link -live"
              target="_blank"
              rel="noopener noreferrer"
            >
              Web
            </a>
          )}
          {fields.body && (
            <Link href={`/posts/${fields.slug}`} className="item-link">
              Blog
            </Link>
          )}
          {fields.githubUrl && (
            <a
              href={fields.githubUrl}
              className="item-link -code"
              target="_blank"
              rel="noopener noreferrer"
            >
              Code
            </a>
          )}
          <span className="item-title">{fields.title}</span>
        </span>
        <span className="item-date">
          <time dateTime={dateTime}>{dateString}</time>
        </span>
      </span>
      <span
        className="item-description"
        dangerouslySetInnerHTML={{ __html: fields.description }}
      />
    </article>
  );
}

