import type { Article, ArticleStatus } from '../entities/Article'

export interface CreateArticleParams {
  title: string
  slug: string
  excerpt: string
  content: string
  category: string
  thumbnail: string
  tags: string[]
  status: ArticleStatus
}

export interface UpdateArticleParams extends Partial<CreateArticleParams> {
  author?: string
  publishedAt?: string
  readTime?: number
}

export interface IArticleRepository {
  findAll(): Promise<Article[]>
  findBySlug(slug: string): Promise<Article | null>
  create(params: CreateArticleParams): Promise<Article>
  update(id: string, params: UpdateArticleParams): Promise<Article>
  delete(id: string): Promise<void>
}
