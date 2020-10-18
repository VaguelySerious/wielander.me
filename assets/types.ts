export interface BlogPost {
  title: string
  slug: string
  description: string
  body: string
  publishDate: string
  thumbImage?: string
  heroImage?: string
  tags?: string[]
  githubUrl?: string
  projectUrl?: string
}
