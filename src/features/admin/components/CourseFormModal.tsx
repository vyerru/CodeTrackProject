import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { X, Loader2 } from 'lucide-react'
import type { Course } from '@/shared/types'
import { categories, levels, slugify } from './admin-helpers'

const courseSchema = z.object({
  title: z.string().min(3, 'Judul minimal 3 karakter'),
  slug: z.string().min(3, 'Slug minimal 3 karakter').regex(/^[a-z0-9-]+$/, 'Slug hanya boleh huruf kecil, angka, dan tanda hubung'),
  description: z.string().min(10, 'Deskripsi minimal 10 karakter'),
  category: z.string().min(1, 'Pilih kategori'),
  level: z.enum(['Beginner', 'Intermediate', 'Advanced']),
  instructor: z.string().min(3, 'Nama instruktur minimal 3 karakter'),
  price: z.number().min(0, 'Harga tidak boleh negatif'),
  originalPrice: z.union([z.number().min(0), z.nan()]).optional(),
  thumbnail: z.string().url('URL tidak valid').or(z.literal('')),
  duration: z.number().min(1, 'Durasi minimal 1 jam'),
  status: z.enum(['Published', 'Draft']),
  tags: z.string(),
  isBestseller: z.boolean().optional(),
})

export type CourseFormData = z.infer<typeof courseSchema>

interface Props {
  editingCourse: Course | null
  saving: boolean
  onSave: (data: CourseFormData) => Promise<void>
  onClose: () => void
}

export default function CourseFormModal({ editingCourse, saving, onSave, onClose }: Props) {
  const [manualSlug, setManualSlug] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CourseFormData>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: editingCourse?.title ?? '',
      slug: editingCourse?.slug ?? '',
      description: editingCourse?.description ?? '',
      category: editingCourse?.category ?? categories[0],
      level: editingCourse?.level ?? 'Beginner',
      instructor: editingCourse?.instructor ?? '',
      price: editingCourse?.price ?? 0,
      originalPrice: editingCourse?.originalPrice ?? undefined,
      thumbnail: editingCourse?.thumbnail ?? '',
      duration: editingCourse?.duration ?? 1,
      status: (editingCourse?.status as 'Published' | 'Draft') ?? 'Draft',
      tags: editingCourse?.tags?.join(', ') ?? '',
      isBestseller: editingCourse?.isBestseller ?? false,
    },
  })

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue('title', e.target.value)
    if (!manualSlug && !editingCourse) {
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
            {editingCourse ? 'Edit Course' : 'Tambah Course'}
          </h2>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSave)} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Judul Course</label>
            <input {...register('title')} onChange={handleTitleChange} placeholder="Masukkan judul course" className="w-full h-9 px-3 rounded-lg border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
            <div className="relative">
              <input {...register('slug')} onChange={(e) => { setManualSlug(true); setValue('slug', e.target.value) }} placeholder="judul-course" className="w-full h-9 px-3 rounded-lg border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              {!manualSlug && !editingCourse && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">auto</span>}
            </div>
            {errors.slug && <p className="text-xs text-red-500 mt-1">{errors.slug.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
            <textarea {...register('description')} rows={3} placeholder="Deskripsi course..." className="w-full px-3 py-2 rounded-lg border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none" />
            {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
              <select {...register('category')} className="w-full h-9 px-3 rounded-lg border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                {categories.map((cat) => (<option key={cat} value={cat}>{cat}</option>))}
              </select>
              {errors.category && <p className="text-xs text-red-500 mt-1">{errors.category.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
              <select {...register('level')} className="w-full h-9 px-3 rounded-lg border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                {levels.map((lvl) => (<option key={lvl} value={lvl}>{lvl}</option>))}
              </select>
              {errors.level && <p className="text-xs text-red-500 mt-1">{errors.level.message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Instruktur</label>
            <input {...register('instructor')} placeholder="Nama instruktur" className="w-full h-9 px-3 rounded-lg border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            {errors.instructor && <p className="text-xs text-red-500 mt-1">{errors.instructor.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Harga (Rp)</label>
              <input {...register('price', { valueAsNumber: true })} type="number" min={0} placeholder="0 = gratis" className="w-full h-9 px-3 rounded-lg border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              {errors.price && <p className="text-xs text-red-500 mt-1">{errors.price.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Harga Asli (Rp, opsional)</label>
              <input {...register('originalPrice', { valueAsNumber: true })} type="number" min={0} placeholder="Sebelum diskon" className="w-full h-9 px-3 rounded-lg border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              {errors.originalPrice && <p className="text-xs text-red-500 mt-1">{errors.originalPrice.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">URL Thumbnail</label>
              <input {...register('thumbnail')} placeholder="https://example.com/image.jpg" className="w-full h-9 px-3 rounded-lg border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              {errors.thumbnail && <p className="text-xs text-red-500 mt-1">{errors.thumbnail.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Durasi (jam)</label>
              <input {...register('duration', { valueAsNumber: true })} type="number" min={1} placeholder="Total jam belajar" className="w-full h-9 px-3 rounded-lg border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              {errors.duration && <p className="text-xs text-red-500 mt-1">{errors.duration.message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <div className="flex gap-2 h-9 items-center">
              <button type="button" onClick={() => setValue('status', 'Draft')} className={`flex-1 h-full rounded-lg text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none ${watch('status') === 'Draft' ? 'bg-gray-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>Draft</button>
              <button type="button" onClick={() => setValue('status', 'Published')} className={`flex-1 h-full rounded-lg text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none ${watch('status') === 'Published' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>Published</button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tags (pisahkan dengan koma)</label>
            <input {...register('tags')} placeholder="React, JavaScript, Frontend" className="w-full h-9 px-3 rounded-lg border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            {errors.tags && <p className="text-xs text-red-500 mt-1">{errors.tags.message}</p>}
          </div>

          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" {...register('isBestseller')} className="accent-indigo-600 focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none" />
              <span className="text-sm font-medium text-gray-700">Best Seller</span>
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-2 border-t border-border">
            <button type="button" onClick={onClose} className="px-4 py-2 border border-border rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none">Batal</button>
            <button type="submit" disabled={saving} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-60 flex items-center gap-2 transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none">
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              {saving ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}