import { useState, useEffect } from 'react'
import { useParams } from 'react-router'
import { repos } from '@/core/domain/di'
import type { Article } from '@/shared/types'

function formatDate(iso: string): string {
  const date = new Date(iso)
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`
}

export interface ArticleDetailResult {
  article: (Article & { views: number; formattedDate: string }) | null
  relatedArticles: (Article & { views: number; formattedDate: string })[]
  readProgress: number
  isLoading: boolean
  error: string | null
}

export function useArticleDetail(): ArticleDetailResult {
  const { slug } = useParams<{ slug: string }>()
  const [article, setArticle] = useState<ArticleDetailResult['article']>(null)
  const [relatedArticles, setRelatedArticles] = useState<ArticleDetailResult['relatedArticles']>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [readProgress, setReadProgress] = useState(0)

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      if (!slug) {
        setError('Slug tidak ditemukan')
        setIsLoading(false)
        return
      }

      try {
        const [found, all] = await Promise.all([
          repos.article.findBySlug(slug),
          repos.article.findAll(),
        ])
        if (cancelled) return

        if (!found) {
          setError('Artikel tidak ditemukan')
          setIsLoading(false)
          return
        }

        const enriched = {
          ...found,
          views: Math.floor(Math.random() * 5000) + 500,
          formattedDate: formatDate(found.publishedAt),
        }

        const related = (all as Article[])
          .filter((a) => a.category === found.category && a.id !== found.id)
          .slice(0, 3)
          .map((a) => ({
            ...a,
            views: Math.floor(Math.random() * 5000) + 500,
            formattedDate: formatDate(a.publishedAt),
          }))

        setArticle(enriched)
        setRelatedArticles(related)
        setIsLoading(false)
      } catch {
        if (cancelled) return
        setError('Gagal memuat artikel')
        setIsLoading(false)
      }
    }

    load()

    return () => { cancelled = true }
  }, [slug])

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      if (docHeight > 0) {
        setReadProgress(Math.min((scrollTop / docHeight) * 100, 100))
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return { article, relatedArticles, readProgress, isLoading, error }
}
