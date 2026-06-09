export interface Article {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  author: string
  authorAvatar?: string
  publishedAt: string
  readTime: number
  thumbnail: string
  category: string
  tags: string[]
}
