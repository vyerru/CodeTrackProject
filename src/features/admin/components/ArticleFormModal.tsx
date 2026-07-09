import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { X, Loader2 } from 'lucide-react'
import type { Article, ArticleStatus } from '@/shared/types'
import { categories, slugify } from './admin-helpers'

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

export type ArticleFormData = z.infer<typeof articleSchema>

interface Props {
  editingArticle: Article | null
  saving: boolean
  onSave: (data: ArticleFormData) => Promise<void>
  onClose: () => void
}

export default function ArticleFormModal({ editingArticle, saving, onSave, onClose }: Props) {
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
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
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
              className="w-full h-9 px-3 rounded-lg border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                className="w-full h-9 px-3 rounded-lg border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {!manualSlug && !editingArticle && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">auto</span>
              )}
            </div>
            {errors.slug && <p className="text-xs text-red-500 mt-1">{errors.slug.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
              <select
                {...register('category')}
                className="w-full h-9 px-3 rounded-lg border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
              className="w-full px-3 py-2 rounded-lg border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
            {errors.excerpt && <p className="text-xs text-red-500 mt-1">{errors.excerpt.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">URL Thumbnail</label>
            <input
              {...register('thumbnail')}
              placeholder="https://example.com/image.jpg"
              className="w-full h-9 px-3 rounded-lg border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {errors.thumbnail && <p className="text-xs text-red-500 mt-1">{errors.thumbnail.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Konten</label>
            <textarea
              {...register('content')}
              rows={6}
              placeholder="Tulis konten artikel di sini..."
              className="w-full px-3 py-2 rounded-lg border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
            {errors.content && <p className="text-xs text-red-500 mt-1">{errors.content.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tags (pisahkan dengan koma)</label>
            <input
              {...register('tags')}
              placeholder="React, JavaScript, Frontend"
              className="w-full h-9 px-3 rounded-lg border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {errors.tags && <p className="text-xs text-red-500 mt-1">{errors.tags.message}</p>}
          </div>

          <div className="flex justify-end gap-3 pt-2 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-border rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none"
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