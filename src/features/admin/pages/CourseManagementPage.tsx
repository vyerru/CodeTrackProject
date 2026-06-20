import { useState, useMemo } from 'react'
import { Search, Plus, Edit3, Trash2 } from 'lucide-react'
import { useAsync } from '@/shared/hooks/useAsync'
import { repos } from '@/core/domain/di'
import type { Course } from '@/shared/types'
import { formatRupiah } from '@/shared/utils'
import ErrorState from '@/shared/components/common/ErrorState'
import LoadingSpinner from '@/shared/components/common/LoadingSpinner'

export default function CourseManagementPage() {
  const { data: courses, isLoading, error, refetch } = useAsync<Course[]>(
    () => repos.course.findAll()
  )
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    if (!courses) return []
    if (!search.trim()) return courses
    const q = search.toLowerCase()
    return courses.filter(c => c.title.toLowerCase().includes(q) || c.instructor.toLowerCase().includes(q))
  }, [courses, search])

  if (isLoading) return <LoadingSpinner />
  if (error) return <ErrorState message={error} onRetry={refetch} />

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-xl font-bold text-gray-900">Kelola Course</h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none">
          <Plus className="w-4 h-4" />
          Tambah Course
        </button>
      </div>

      <div className="relative max-w-sm mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari course..."
          className="w-full h-9 pl-10 pr-3 rounded-lg border border-black/10 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div className="bg-white rounded-xl border border-black/10 overflow-hidden">
        <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr] gap-4 p-4 bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
          <span>Judul</span><span>Kategori</span><span>Instruktur</span><span>Siswa</span><span>Harga</span><span>Aksi</span>
        </div>
        <div className="divide-y divide-black/10">
          {filtered.map((c) => (
            <div key={c.id} className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr] gap-2 p-4 items-center text-sm">
              <span className="text-gray-900 font-medium truncate">{c.title}</span>
              <span className="text-gray-500">{c.category}</span>
              <span className="text-gray-500">{c.instructor}</span>
              <span className="text-gray-500">{c.totalStudents.toLocaleString()}</span>
              <span className="font-medium text-gray-900">{c.isFree ? 'Gratis' : formatRupiah(c.price)}</span>
              <div className="flex items-center gap-2">
                <button className="p-1.5 text-gray-400 hover:text-indigo-600 transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none"><Edit3 className="w-4 h-4" /></button>
                <button className="p-1.5 text-gray-400 hover:text-red-500 transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
