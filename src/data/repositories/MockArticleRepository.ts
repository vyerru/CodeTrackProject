import type { IArticleRepository } from '@/core/domain/repositories/IArticleRepository'
import type { Article } from '@/core/domain/entities/Article'
import { articles } from '../sources/mock'
import { delay } from './helpers'

export class MockArticleRepository implements IArticleRepository {
  async findAll(): Promise<Article[]> {
    await delay()
    return articles as Article[]
  }

  async findBySlug(slug: string): Promise<Article | null> {
    await delay()
    return (articles as Article[]).find(a => a.slug === slug) ?? null
  }
}
