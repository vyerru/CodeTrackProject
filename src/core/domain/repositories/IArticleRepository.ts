import type { Article } from '../entities/Article'

export interface IArticleRepository {
  findAll(): Promise<Article[]>
  findBySlug(slug: string): Promise<Article | null>
}
