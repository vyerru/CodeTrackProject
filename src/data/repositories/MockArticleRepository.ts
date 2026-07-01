import type { IArticleRepository, CreateArticleParams, UpdateArticleParams } from '@/core/domain/repositories/IArticleRepository'
import type { Article } from '@/core/domain/entities/Article'
import { articles } from '../sources/mock'
import { delay } from './helpers'

export class MockArticleRepository implements IArticleRepository {
  private items: Article[]

  constructor() {
    this.items = (articles as Article[]).map((a) => ({
      ...a,
      status: a.status ?? 'Published',
      views: a.views ?? 0,
    }))
  }

  async findAll(): Promise<Article[]> {
    await delay()
    return [...this.items]
  }

  async findBySlug(slug: string): Promise<Article | null> {
    await delay()
    return this.items.find((a) => a.slug === slug) ?? null
  }

  async create(params: CreateArticleParams): Promise<Article> {
    await delay()
    const article: Article = {
      id: String(Date.now()),
      slug: params.slug,
      title: params.title,
      excerpt: params.excerpt,
      content: params.content,
      author: 'Admin',
      authorAvatar: undefined,
      publishedAt: params.status === 'Published' ? new Date().toISOString().slice(0, 10) : '',
      readTime: Math.max(1, Math.ceil(params.content.split(' ').length / 200)),
      thumbnail: params.thumbnail,
      category: params.category,
      tags: params.tags,
      status: params.status,
      views: 0,
    }
    this.items.push(article)
    return article
  }

  async update(id: string, params: UpdateArticleParams): Promise<Article> {
    await delay()
    const index = this.items.findIndex((a) => a.id === id)
    if (index === -1) throw new Error('Artikel tidak ditemukan')

    const existing = this.items[index]
    const updated: Article = {
      ...existing,
      ...params,
      readTime: params.content
        ? Math.max(1, Math.ceil(params.content.split(' ').length / 200))
        : existing.readTime,
    }
    this.items[index] = updated
    return updated
  }

  async delete(id: string): Promise<void> {
    await delay()
    const index = this.items.findIndex((a) => a.id === id)
    if (index === -1) throw new Error('Artikel tidak ditemukan')
    this.items.splice(index, 1)
  }
}