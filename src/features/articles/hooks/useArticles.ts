import { useState, useEffect, useMemo } from 'react'
import { repos } from '@/core/domain/di'
import type { Article } from '@/shared/types'

const ITEMS_PER_PAGE = 6

function formatDate(iso: string): string {
  const date = new Date(iso)
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`
}

export interface ArticleWithMeta extends Article {
  views: number
  formattedDate: string
}

export function useArticles() {
  const [allArticles, setAllArticles] = useState<ArticleWithMeta[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('Semua')
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    let cancelled = false
    repos.article.findAll().then((articles) => {
      if (cancelled) return
      const withMeta = (articles as Article[]).map((a) => ({
        ...a,
        views: Math.floor(Math.random() * 5000) + 500,
        formattedDate: formatDate(a.publishedAt),
      }))
      setAllArticles(withMeta)
      setIsLoading(false)
    }).catch(() => {
      if (cancelled) return
      setError('Gagal memuat artikel')
      setIsLoading(false)
    })
    return () => { cancelled = true }
  }, [])

  const categories = useMemo(() => {
    const cats = ['Semua', ...new Set(allArticles.map((a) => a.category))]
    return cats
  }, [allArticles])

  const tags = useMemo(() => {
    const tagSet = new Set<string>()
    allArticles.forEach((a) => a.tags.forEach((t) => tagSet.add(t)))
    return Array.from(tagSet)
  }, [allArticles])

  const filtered = useMemo(() => {
    let result = allArticles
    if (activeCategory !== 'Semua') {
      result = result.filter((a) => a.category === activeCategory)
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.excerpt.toLowerCase().includes(q) ||
          a.tags.some((t) => t.toLowerCase().includes(q))
      )
    }
    return result
  }, [allArticles, activeCategory, searchQuery])

  const featuredArticle = useMemo(() => {
    if (filtered.length === 0) return null
    return filtered[0]
  }, [filtered])

  const paginated = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return filtered.slice(start, start + ITEMS_PER_PAGE)
  }, [filtered, currentPage])

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE))

  const popularArticles = useMemo(() => {
    return [...allArticles].sort((a, b) => b.views - a.views).slice(0, 5)
  }, [allArticles])

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat)
    setCurrentPage(1)
  }

  const handleSearchChange = (q: string) => {
    setSearchQuery(q)
    setCurrentPage(1)
  }

  return {
    articles: paginated,
    featuredArticle,
    popularArticles,
    categories,
    tags,
    isLoading,
    error,
    searchQuery,
    setSearchQuery: handleSearchChange,
    activeCategory,
    setActiveCategory: handleCategoryChange,
    currentPage,
    setCurrentPage,
    totalPages,
  }
}
