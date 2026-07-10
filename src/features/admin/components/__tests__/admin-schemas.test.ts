import { describe, it, expect } from 'vitest'
import { z } from 'zod'

const articleSchema = z.object({
  title: z.string().min(3, 'Judul minimal 3 karakter'),
  slug: z.string().min(3, 'Slug minimal 3 karakter').regex(/^[a-z0-9-]+$/, 'Slug hanya boleh huruf kecil, angka, dan tanda hubung'),
  category: z.string().min(1, 'Pilih kategori'),
  status: z.enum(['Published', 'Draft']),
  excerpt: z.string().min(10, 'Excerpt minimal 10 karakter'),
  thumbnail: z.string().url('URL tidak valid').or(z.literal('')),
  content: z.string().min(20, 'Konten minimal 20 karakter'),
  tags: z.string(),
})

const courseSchema = z.object({
  title: z.string().min(3, 'Judul minimal 3 karakter'),
  slug: z.string().min(3).regex(/^[a-z0-9-]+$/),
  description: z.string().min(10),
  category: z.string().min(1),
  level: z.enum(['Beginner', 'Intermediate', 'Advanced']),
  instructor: z.string().min(3),
  price: z.number().min(0),
  duration: z.number().min(1),
  status: z.enum(['Published', 'Draft']),
  tags: z.string(),
  isBestseller: z.boolean().optional(),
})

describe('Article Schema', () => {
  const valid = {
    title: 'Test Article Title',
    slug: 'test-article',
    category: 'Web Development',
    status: 'Published' as const,
    excerpt: 'This is a good excerpt for testing',
    thumbnail: '',
    content: 'This is the content of the article with enough characters to pass validation',
    tags: 'React, JavaScript',
  }

  it('accepts valid article', () => {
    expect(articleSchema.safeParse(valid).success).toBe(true)
  })

  it('rejects short title', () => {
    expect(articleSchema.safeParse({ ...valid, title: 'Ab' }).success).toBe(false)
  })

  it('rejects invalid slug', () => {
    expect(articleSchema.safeParse({ ...valid, slug: 'UPPERCASE_SLUG' }).success).toBe(false)
  })

  it('rejects short excerpt', () => {
    expect(articleSchema.safeParse({ ...valid, excerpt: 'Short' }).success).toBe(false)
  })

  it('rejects short content', () => {
    expect(articleSchema.safeParse({ ...valid, content: 'Short content' }).success).toBe(false)
  })

  it('accepts empty thumbnail', () => {
    expect(articleSchema.safeParse({ ...valid, thumbnail: '' }).success).toBe(true)
  })

  it('rejects invalid thumbnail URL', () => {
    expect(articleSchema.safeParse({ ...valid, thumbnail: 'not-a-url' }).success).toBe(false)
  })
})

describe('Course Schema', () => {
  const valid = {
    title: 'Complete Web Development',
    slug: 'complete-web-dev',
    description: 'A comprehensive course covering HTML CSS JavaScript React Node.js',
    category: 'Web Development',
    level: 'Beginner' as const,
    instructor: 'John Doe',
    price: 299000,
    duration: 32,
    status: 'Published' as const,
    tags: 'HTML, CSS, JavaScript',
    isBestseller: true,
  }

  it('accepts valid course', () => {
    expect(courseSchema.safeParse(valid).success).toBe(true)
  })

  it('rejects zero price', () => {
    expect(courseSchema.safeParse({ ...valid, price: -1 }).success).toBe(false)
  })

  it('rejects zero duration', () => {
    expect(courseSchema.safeParse({ ...valid, duration: 0 }).success).toBe(false)
  })

  it('rejects invalid level', () => {
    expect(courseSchema.safeParse({ ...valid, level: 'Expert' }).success).toBe(false)
  })

  it('rejects short instructor name', () => {
    expect(courseSchema.safeParse({ ...valid, instructor: 'Jo' }).success).toBe(false)
  })
})