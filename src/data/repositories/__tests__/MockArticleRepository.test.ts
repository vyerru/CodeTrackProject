import { describe, it, expect, beforeEach } from 'vitest'
import { MockArticleRepository } from '../MockArticleRepository'
import type { CreateArticleParams } from '@/core/domain/repositories/IArticleRepository'

function makeRepo() {
  return new MockArticleRepository()
}

describe('MockArticleRepository', () => {
  let repo: MockArticleRepository

  beforeEach(() => {
    repo = makeRepo()
  })

  describe('findAll', () => {
    it('returns all articles', async () => {
      const articles = await repo.findAll()
      expect(articles.length).toBeGreaterThan(0)
      expect(articles[0]).toHaveProperty('id')
      expect(articles[0]).toHaveProperty('title')
    })

    it('returns published articles by default', async () => {
      const articles = await repo.findAll()
      const published = articles.filter(a => a.status === 'Published')
      expect(published.length).toBeGreaterThan(0)
    })
  })

  describe('findBySlug', () => {
    it('returns article by slug', async () => {
      const article = await repo.findBySlug('belajar-react-hooks')
      expect(article).not.toBeNull()
      expect(article!.title).toContain('React Hooks')
    })

    it('returns null for non-existent slug', async () => {
      const article = await repo.findBySlug('non-existent-slug')
      expect(article).toBeNull()
    })
  })

  describe('create', () => {
    const params: CreateArticleParams = {
      title: 'Test Article',
      slug: 'test-article',
      excerpt: 'This is a test article excerpt',
      content: 'This is the content of the test article. It has more than 20 characters for sure now.',
      category: 'Web Development',
      thumbnail: 'https://example.com/thumb.jpg',
      tags: ['test', 'article'],
      status: 'Published',
    }

    it('creates a new article with generated id', async () => {
      const article = await repo.create(params)
      expect(article.id).toBeTruthy()
      expect(article.title).toBe('Test Article')
    })

    it('assigns author as Admin', async () => {
      const article = await repo.create(params)
      expect(article.author).toBe('Admin')
    })

    it('calculates readTime from content length', async () => {
      const article = await repo.create(params)
      expect(article.readTime).toBeGreaterThanOrEqual(1)
    })

    it('persists the created article in findAll', async () => {
      await repo.create(params)
      const all = await repo.findAll()
      expect(all.some(a => a.title === 'Test Article')).toBe(true)
    })
  })

  describe('update', () => {
    it('updates article fields', async () => {
      const all = await repo.findAll()
      const first = all[0]
      const updated = await repo.update(first.id, { title: 'Updated Title' })
      expect(updated.title).toBe('Updated Title')
    })

    it('throws for non-existent id', async () => {
      await expect(repo.update('non-existent', { title: 'X' })).rejects.toThrow('Artikel tidak ditemukan')
    })
  })

  describe('delete', () => {
    it('removes article from list', async () => {
      const before = await repo.findAll()
      const target = before[0]
      await repo.delete(target.id)
      const after = await repo.findAll()
      expect(after.length).toBe(before.length - 1)
      expect(after.some(a => a.id === target.id)).toBe(false)
    })

    it('throws for non-existent id', async () => {
      await expect(repo.delete('non-existent')).rejects.toThrow('Artikel tidak ditemukan')
    })
  })
})