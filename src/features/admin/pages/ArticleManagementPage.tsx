import { useState, useMemo, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Search, Plus, Edit3, Trash2, Eye, X, Check,
  Loader2, FileText, Bookmark, Eye as EyeIcon, FileEdit,
} from 'lucide-react'
import { useAsync } from '@/shared/hooks/useAsync'
import { repos } from '@/core/domain/di'
import { getCategoryColor } from '@/shared/utils'
import type { Article, ArticleStatus } from '@/shared/types'
import type { CreateArticleParams, UpdateArticleParams } from '@/core/domain/repositories/IArticleRepository'
import ErrorState from '@/shared/components/common/ErrorState'
import LoadingSpinner from '@/shared/components/common/LoadingSpinner'
import EmptyState from '@/shared/components/common/EmptyState'
import ImageWithFallback from '@/shared/components/common/ImageWithFallback'

const categories = [
  'Web Development',
  'Data Science',
  'Mobile Development',
  'Backend Development',
  'DevOps',
  'Cloud Computing',
  'Design',
]

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

type ArticleFormData = z.infer<typeof articleSchema>

const perPage = 5

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export default function ArticleManagementPage() {
  const { data: articles, isLoading, error, refetch } = useAsync<Article[]>(
    () => repos.article.findAll()
  )

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | ArticleStatus>('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [page, setPage] = useState(1)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Article | null>(null)
  const [saving, setSaving] = useState(false)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const filtered = useMemo(() => {
    if (!articles) return []
    let result = articles

    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(
        (a) => a.title.toLowerCase().includes(q) || a.author.toLowerCase().includes(q)
      )
    }

    if (statusFilter !== 'all') {
      result = result.filter((a) => a.status === statusFilter)
    }

    if (categoryFilter !== 'all') {
      result = result.filter((a) => a.category === categoryFilter)
    }

    return result
  }, [articles, search, statusFilter, categoryFilter])

  const totalPages = Math.ceil(filtered.length / perPage)
  const visibleArticles = filtered.slice((page - 1) * perPage, page * perPage)

  const stats = useMemo(() => {
    if (!articles) return { total: 0, published: 0, draft: 0, totalViews: 0 }
    return {
      total: articles.length,
      published: articles.filter((a) => a.status === 'Published').length,
      draft: articles.filter((a) => a.status === 'Draft' || !a.status).length,
      totalViews: articles.reduce((sum, a) => sum + (a.views ?? 0), 0),
    }
  }, [articles])

  const resetFilters = useCallback(() => {
    setSearch('')
    setStatusFilter('all')
    setCategoryFilter('all')
    setPage(1)
  }, [])

  const selectAll = useCallback(
    (checked: boolean) => {
      if (checked) {
        setSelectedIds(new Set(visibleArticles.map((a) => a.id)))
      } else {
        setSelectedIds(new Set())
      }
    },
    [visibleArticles]
  )

  const toggleSelect = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  const openAddModal = () => {
    setEditingId(null)
    setModalOpen(true)
  }

  const openEditModal = (article: Article) => {
    setEditingId(article.id)
    setModalOpen(true)
  }

  const handleSave = async (data: ArticleFormData) => {
    setSaving(true)
    try {
      const tags = data.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean)

      if (editingId) {
        const params: UpdateArticleParams = {
          title: data.title,
          slug: data.slug,
          category: data.category,
          status: data.status,
          excerpt: data.excerpt,
          thumbnail: data.thumbnail,
          content: data.content,
          tags,
        }
        await repos.article.update(editingId, params)
      } else {
        const params: CreateArticleParams = {
          title: data.title,
          slug: data.slug,
          category: data.category,
          status: data.status,
          excerpt: data.excerpt,
          thumbnail: data.thumbnail,
          content: data.content,
          tags,
        }
        await repos.article.create(params)
      }
      setModalOpen(false)
      refetch()
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    setActionLoading(id)
    try {
      await repos.article.delete(id)
      setDeleteTarget(null)
      setSelectedIds((prev) => {
        const next = new Set(prev)
        next.delete(id)
        return next
      })
      refetch()
    } finally {
      setActionLoading(null)
    }
  }

  const handleBulkAction = async (action: 'publish' | 'draft' | 'delete') => {
    setActionLoading('bulk')
    try {
      for (const id of selectedIds) {
        if (action === 'delete') {
          await repos.article.delete(id)
        } else {
          await repos.article.update(id, {
            status: action === 'publish' ? 'Published' : 'Draft',
          })
        }
      }
      setSelectedIds(new Set())
      refetch()
    } finally {
      setActionLoading(null)
    }
  }

  const editingArticle = useMemo(() => {
    if (!editingId || !articles) return null
    return articles.find((a) => a.id === editingId) ?? null
  }, [editingId, articles])

  if (isLoading) return <LoadingSpinner fullPage />
  if (error) return <ErrorState message={error} onRetry={refetch} />

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-xl font-bold text-gray-900">Kelola Artikel</h1>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none"
        >
          <Plus className="w-4 h-4" />
          Tambah Artikel
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-black/10 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
              <FileText className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              <p className="text-xs text-gray-500">Total Artikel</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-black/10 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <Bookmark className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.published}</p>
              <p className="text-xs text-gray-500">Published</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-black/10 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
              <FileEdit className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.draft}</p>
              <p className="text-xs text-gray-500">Draft</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-black/10 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <EyeIcon className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.totalViews.toLocaleString()}</p>
              <p className="text-xs text-gray-500">Total Views</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari judul artikel..."
            className="w-full h-9 pl-10 pr-3 rounded-lg border border-black/10 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value as typeof statusFilter); setPage(1) }}
          className="h-9 px-3 rounded-lg border border-black/10 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="all">Semua Status</option>
          <option value="Published">Published</option>
          <option value="Draft">Draft</option>
        </select>
        <select
          value={categoryFilter}
          onChange={(e) => { setCategoryFilter(e.target.value); setPage(1) }}
          className="h-9 px-3 rounded-lg border border-black/10 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="all">Semua Kategori</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <button
          onClick={resetFilters}
          className="h-9 px-3 rounded-lg border border-black/10 bg-white text-sm text-gray-600 hover:bg-gray-50 transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none"
        >
          Reset
        </button>
      </div>

      {selectedIds.size > 0 && (
        <div className="flex items-center gap-3 mb-4 px-4 py-3 bg-indigo-50 rounded-xl border border-indigo-200">
          <span className="text-sm font-medium text-indigo-700">
            {selectedIds.size} artikel dipilih
          </span>
          <div className="flex gap-2 ml-auto">
            <button
              onClick={() => handleBulkAction('publish')}
              disabled={actionLoading === 'bulk'}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs font-medium hover:bg-green-700 disabled:opacity-50 transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none"
            >
              {actionLoading === 'bulk' ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
              Publish
            </button>
            <button
              onClick={() => handleBulkAction('draft')}
              disabled={actionLoading === 'bulk'}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 text-white rounded-lg text-xs font-medium hover:bg-amber-700 disabled:opacity-50 transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none"
            >
              {actionLoading === 'bulk' ? <Loader2 className="w-3 h-3 animate-spin" /> : <FileEdit className="w-3 h-3" />}
              Draft
            </button>
            <button
              onClick={() => handleBulkAction('delete')}
              disabled={actionLoading === 'bulk'}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 text-white rounded-lg text-xs font-medium hover:bg-red-700 disabled:opacity-50 transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none"
            >
              {actionLoading === 'bulk' ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
              Hapus
            </button>
          </div>
        </div>
      )}

      {visibleArticles.length === 0 ? (
        <EmptyState
          title="Tidak ada artikel"
          description="Belum ada artikel yang sesuai dengan filter atau kriteria pencarian."
          action={search || statusFilter !== 'all' || categoryFilter !== 'all' ? { label: 'Reset Filter', onClick: resetFilters } : { label: 'Tambah Artikel', onClick: openAddModal }}
        />
      ) : (
        <>
          <div className="bg-white rounded-xl border border-black/10 overflow-hidden">
            <div className="hidden lg:grid grid-cols-[36px_3fr_1fr_1fr_1fr_1fr_80px_120px] gap-3 p-4 bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider items-center">
              <div>
                <input
                  type="checkbox"
                  checked={visibleArticles.length > 0 && selectedIds.size === visibleArticles.length}
                  onChange={(e) => selectAll(e.target.checked)}
                  className="accent-indigo-600 focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none"
                />
              </div>
              <span>Judul</span>
              <span>Kategori</span>
              <span>Author</span>
              <span>Tanggal</span>
              <span>Status</span>
              <span className="text-center">Views</span>
              <span className="text-center">Aksi</span>
            </div>
            <div className="divide-y divide-black/10">
              {visibleArticles.map((article) => {
                const isSelected = selectedIds.has(article.id)
                const isDeleting = actionLoading === article.id
                return (
                  <div
                    key={article.id}
                    className={`grid grid-cols-1 lg:grid-cols-[36px_3fr_1fr_1fr_1fr_1fr_80px_120px] gap-3 p-4 items-center text-sm ${
                      isSelected ? 'bg-indigo-50/50' : ''
                    }`}
                  >
                    <div className="flex lg:hidden items-center gap-3 mb-2">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelect(article.id)}
                        className="accent-indigo-600 focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none"
                      />
                    </div>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelect(article.id)}
                      className="hidden lg:block accent-indigo-600 focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none"
                    />
                    <div className="flex items-start gap-3 min-w-0">
                      <ImageWithFallback
                        src={article.thumbnail}
                        alt={article.title}
                        className="w-14 h-10 rounded-lg object-cover flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-gray-900 font-medium truncate">{article.title}</p>
                        <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">{article.excerpt}</p>
                      </div>
                    </div>
                    <span className={`inline-block w-max px-2 py-0.5 rounded text-xs font-medium text-white ${getCategoryColor(article.category)}`}>
                      {article.category}
                    </span>
                    <span className="text-gray-500 truncate">{article.author}</span>
                    <span className="text-gray-500">
                      {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString('id-ID') : '-'}
                    </span>
                    <span className={`inline-block w-max px-2 py-0.5 rounded-full text-xs font-medium ${
                      article.status === 'Published'
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-400 text-white'
                    }`}>
                      {article.status ?? 'Draft'}
                    </span>
                    <span className="text-gray-500 text-center">{article.views?.toLocaleString() ?? 0}</span>
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => openEditModal(article)}
                        className="p-1.5 text-gray-400 hover:text-indigo-600 transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none rounded"
                        title="Edit"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none rounded"
                        title="Preview"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(article)}
                        disabled={isDeleting}
                        className="p-1.5 text-gray-400 hover:text-red-500 transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none rounded disabled:opacity-50"
                        title="Hapus"
                      >
                        {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 text-sm text-gray-500">
            <span>
              Menampilkan {Math.min((page - 1) * perPage + 1, filtered.length)}-{Math.min(page * perPage, filtered.length)} dari {filtered.length} artikel
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="px-3 py-1.5 rounded-lg border border-black/10 bg-white text-sm hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none"
              >
                Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                .reduce<(number | 'ellipsis')[]>((acc, p, idx, arr) => {
                  if (idx > 0 && p - arr[idx - 1] > 1) acc.push('ellipsis')
                  acc.push(p)
                  return acc
                }, [])
                .map((p, idx) =>
                  p === 'ellipsis' ? (
                    <span key={`e-${idx}`} className="px-2 text-gray-400">...</span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none ${
                        page === p
                          ? 'bg-indigo-600 text-white'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {p}
                    </button>
                  )
                )}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="px-3 py-1.5 rounded-lg border border-black/10 bg-white text-sm hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}

      {modalOpen && (
        <ArticleFormModal
          editingArticle={editingArticle}
          saving={saving}
          onSave={handleSave}
          onClose={() => setModalOpen(false)}
        />
      )}

      {deleteTarget && (
        <DeleteConfirmDialog
          article={deleteTarget}
          loading={actionLoading === deleteTarget.id}
          onConfirm={() => handleDelete(deleteTarget.id)}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  )
}

function ArticleFormModal({
  editingArticle,
  saving,
  onSave,
  onClose,
}: {
  editingArticle: Article | null
  saving: boolean
  onSave: (data: ArticleFormData) => Promise<void>
  onClose: () => void
}) {
  const [manualSlug, setManualSlug] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ArticleFormData>({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      title: editingArticle?.title ?? '',
      slug: editingArticle?.slug ?? '',
      category: editingArticle?.category ?? categories[0],
      status: (editingArticle?.status as ArticleStatus) ?? 'Draft',
      excerpt: editingArticle?.excerpt ?? '',
      thumbnail: editingArticle?.thumbnail ?? '',
      content: editingArticle?.content ?? '',
      tags: editingArticle?.tags?.join(', ') ?? '',
    },
  })

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue('title', e.target.value)
    if (!manualSlug && !editingArticle) {
      setValue('slug', slugify(e.target.value))
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-8 overflow-y-auto bg-black/50" onClick={onClose}>
      <div
        className="w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-black/10">
          <h2 className="text-lg font-semibold text-gray-900">
            {editingArticle ? 'Edit Artikel' : 'Tambah Artikel'}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSave)} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Judul Artikel</label>
            <input
              {...register('title')}
              onChange={handleTitleChange}
              placeholder="Masukkan judul artikel"
              className="w-full h-9 px-3 rounded-lg border border-black/10 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
            <div className="relative">
              <input
                {...register('slug')}
                onChange={(e) => { setManualSlug(true); setValue('slug', e.target.value) }}
                placeholder="judul-artikel"
                className="w-full h-9 px-3 rounded-lg border border-black/10 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {!manualSlug && !editingArticle && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                  auto
                </span>
              )}
            </div>
            {errors.slug && <p className="text-xs text-red-500 mt-1">{errors.slug.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
              <select
                {...register('category')}
                className="w-full h-9 px-3 rounded-lg border border-black/10 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              {errors.category && <p className="text-xs text-red-500 mt-1">{errors.category.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <div className="flex gap-2 h-9 items-center">
                <button
                  type="button"
                  onClick={() => setValue('status', 'Draft')}
                  className={`flex-1 h-full rounded-lg text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none ${
                    watch('status') === 'Draft'
                      ? 'bg-gray-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Draft
                </button>
                <button
                  type="button"
                  onClick={() => setValue('status', 'Published')}
                  className={`flex-1 h-full rounded-lg text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none ${
                    watch('status') === 'Published'
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Published
                </button>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt</label>
            <textarea
              {...register('excerpt')}
              rows={2}
              placeholder="Ringkasan singkat artikel..."
              className="w-full px-3 py-2 rounded-lg border border-black/10 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
            {errors.excerpt && <p className="text-xs text-red-500 mt-1">{errors.excerpt.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">URL Thumbnail</label>
            <input
              {...register('thumbnail')}
              placeholder="https://example.com/image.jpg"
              className="w-full h-9 px-3 rounded-lg border border-black/10 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {errors.thumbnail && <p className="text-xs text-red-500 mt-1">{errors.thumbnail.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Konten</label>
            <textarea
              {...register('content')}
              rows={6}
              placeholder="Tulis konten artikel di sini..."
              className="w-full px-3 py-2 rounded-lg border border-black/10 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
            {errors.content && <p className="text-xs text-red-500 mt-1">{errors.content.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tags (pisahkan dengan koma)</label>
            <input
              {...register('tags')}
              placeholder="React, JavaScript, Frontend"
              className="w-full h-9 px-3 rounded-lg border border-black/10 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {errors.tags && <p className="text-xs text-red-500 mt-1">{errors.tags.message}</p>}
          </div>

          <div className="flex justify-end gap-3 pt-2 border-t border-black/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-black/10 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-60 flex items-center gap-2 transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none"
            >
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              {saving ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function DeleteConfirmDialog({
  article,
  loading,
  onConfirm,
  onCancel,
}: {
  article: Article
  loading: boolean
  onConfirm: () => void
  onCancel: () => void
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onCancel}>
      <div
        className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
            <Trash2 className="w-5 h-5 text-red-600" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900">Hapus Artikel</h2>
        </div>
        <p className="text-sm text-gray-600 mb-1">
          Apakah Anda yakin ingin menghapus artikel berikut?
        </p>
        <p className="text-sm font-medium text-gray-900 mb-6 bg-gray-50 rounded-lg p-3">
          &ldquo;{article.title}&rdquo;
        </p>
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 border border-black/10 rounded-lg text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-60 flex items-center gap-2 transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading ? 'Menghapus...' : 'Hapus'}
          </button>
        </div>
      </div>
    </div>
  )
}