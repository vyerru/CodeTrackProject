import { useState, useMemo, useCallback } from 'react'
import {
  Search, Plus, Edit3, Trash2, Eye, Check,
  Loader2, BookOpen, Bookmark, FileEdit, Users, DollarSign,
} from 'lucide-react'
import { useAsync } from '@/shared/hooks/useAsync'
import { repos } from '@/core/domain/di'
import { formatRupiah, formatRupiahShort, getLevelColor } from '@/shared/utils'
import { getCategoryColor } from '@/shared/utils'
import type { Course, CourseLevel, CourseCategory } from '@/shared/types'
import ErrorState from '@/shared/components/common/ErrorState'
import EmptyState from '@/shared/components/common/EmptyState'
import ImageWithFallback from '@/shared/components/common/ImageWithFallback'
import CourseFormModal from '@/features/admin/components/CourseFormModal'
import type { CourseFormData } from '@/features/admin/components/CourseFormModal'
import CourseDeleteDialog from '@/features/admin/components/CourseDeleteDialog'
import ManagementPageSkeleton from '@/features/admin/components/ManagementPageSkeleton'
import { categories, levels } from '@/features/admin/components/admin-helpers'

const perPage = 5

function getInitials(name: string) {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
}

export default function CourseManagementPage() {
  const { data: courses, isLoading, error, refetch } = useAsync<Course[]>(
    () => repos.course.findAll()
  )

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'Published' | 'Draft'>('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [levelFilter, setLevelFilter] = useState<'all' | CourseLevel>('all')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [page, setPage] = useState(1)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Course | null>(null)
  const [saving, setSaving] = useState(false)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const filtered = useMemo(() => {
    if (!courses) return []
    let result = courses
    if (search.trim()) { const q = search.toLowerCase(); result = result.filter((c) => c.title.toLowerCase().includes(q) || c.instructor.toLowerCase().includes(q)) }
    if (statusFilter !== 'all') result = result.filter((c) => c.status === statusFilter)
    if (categoryFilter !== 'all') result = result.filter((c) => c.category === categoryFilter)
    if (levelFilter !== 'all') result = result.filter((c) => c.level === levelFilter)
    return result
  }, [courses, search, statusFilter, categoryFilter, levelFilter])

  const totalPages = Math.ceil(filtered.length / perPage)
  const visibleCourses = filtered.slice((page - 1) * perPage, page * perPage)

  const stats = useMemo(() => {
    if (!courses) return { total: 0, published: 0, draft: 0, totalStudents: 0, totalRevenue: 0 }
    return {
      total: courses.length,
      published: courses.filter((c) => c.status === 'Published').length,
      draft: courses.filter((c) => c.status === 'Draft' || !c.status).length,
      totalStudents: courses.reduce((sum, c) => sum + c.totalStudents, 0),
      totalRevenue: courses.reduce((sum, c) => sum + (c.revenue ?? 0), 0),
    }
  }, [courses])

  const resetFilters = useCallback(() => { setSearch(''); setStatusFilter('all'); setCategoryFilter('all'); setLevelFilter('all'); setPage(1) }, [])
  const selectAll = useCallback((checked: boolean) => { setSelectedIds(checked ? new Set(visibleCourses.map((c) => c.id)) : new Set()) }, [visibleCourses])
  const toggleSelect = useCallback((id: string) => setSelectedIds((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n }), [])

  const openAddModal = () => { setEditingId(null); setModalOpen(true) }
  const openEditModal = (course: Course) => { setEditingId(course.id); setModalOpen(true) }

  const handleSave = async (data: CourseFormData) => {
    setSaving(true)
    try {
      const tags = data.tags.split(',').map((t) => t.trim()).filter(Boolean)
      const base = {
        title: data.title, slug: data.slug, description: data.description,
        category: data.category as CourseCategory, level: data.level as CourseLevel,
        instructor: data.instructor, price: data.price,
        originalPrice: data.originalPrice === undefined || (typeof data.originalPrice === 'number' && isNaN(data.originalPrice)) ? undefined : data.originalPrice,
        thumbnail: data.thumbnail, duration: data.duration,
        status: data.status as 'Published' | 'Draft', tags, isBestseller: data.isBestseller ?? false,
      }
      if (editingId) await repos.course.update(editingId, base)
      else await repos.course.create(base)
      setModalOpen(false); refetch()
    } finally { setSaving(false) }
  }

  const handleDelete = async (id: string) => {
    setActionLoading(id)
    try { await repos.course.delete(id); setDeleteTarget(null); setSelectedIds((prev) => { const n = new Set(prev); n.delete(id); return n }); refetch() }
    finally { setActionLoading(null) }
  }

  const handleBulkAction = async (action: 'publish' | 'draft' | 'delete') => {
    setActionLoading('bulk')
    try {
      for (const id of selectedIds) {
        if (action === 'delete') await repos.course.delete(id)
        else await repos.course.update(id, { status: action === 'publish' ? 'Published' : 'Draft' })
      }
      setSelectedIds(new Set()); refetch()
    } finally { setActionLoading(null) }
  }

  const editingCourse = useMemo(() => {
    if (!editingId || !courses) return null
    return courses.find((c) => c.id === editingId) ?? null
  }, [editingId, courses])

  if (isLoading) return <ManagementPageSkeleton statCount={5} />
  if (error) return <ErrorState message={error} onRetry={refetch} />

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-xl font-bold text-gray-900">Kelola Produk</h1>
        <button onClick={openAddModal} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none">
          <Plus className="w-4 h-4" /> Tambah Course
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-border p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center"><BookOpen className="w-5 h-5 text-indigo-600" /></div>
            <div><p className="text-2xl font-bold text-gray-900">{stats.total}</p><p className="text-xs text-gray-500">Total Course</p></div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-border p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center"><Bookmark className="w-5 h-5 text-green-600" /></div>
            <div><p className="text-2xl font-bold text-gray-900">{stats.published}</p><p className="text-xs text-gray-500">Published</p></div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-border p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center"><FileEdit className="w-5 h-5 text-amber-600" /></div>
            <div><p className="text-2xl font-bold text-gray-900">{stats.draft}</p><p className="text-xs text-gray-500">Draft</p></div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-border p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center"><Users className="w-5 h-5 text-blue-600" /></div>
            <div><p className="text-2xl font-bold text-gray-900">{stats.totalStudents.toLocaleString()}</p><p className="text-xs text-gray-500">Total Students</p></div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-border p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center"><DollarSign className="w-5 h-5 text-emerald-600" /></div>
            <div><p className="text-2xl font-bold text-gray-900">{formatRupiahShort(stats.totalRevenue)}</p><p className="text-xs text-gray-500">Total Revenue</p></div>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari judul atau instruktur..." className="w-full h-9 pl-10 pr-3 rounded-lg border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
        <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value as typeof statusFilter); setPage(1) }} className="h-9 px-3 rounded-lg border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
          <option value="all">Semua Status</option>
          <option value="Published">Published</option>
          <option value="Draft">Draft</option>
        </select>
        <select value={categoryFilter} onChange={(e) => { setCategoryFilter(e.target.value); setPage(1) }} className="h-9 px-3 rounded-lg border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
          <option value="all">Semua Kategori</option>
          {categories.map((cat) => (<option key={cat} value={cat}>{cat}</option>))}
        </select>
        <select value={levelFilter} onChange={(e) => { setLevelFilter(e.target.value as typeof levelFilter); setPage(1) }} className="h-9 px-3 rounded-lg border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
          <option value="all">Semua Level</option>
          {levels.map((lvl) => (<option key={lvl} value={lvl}>{lvl}</option>))}
        </select>
        <button onClick={resetFilters} className="h-9 px-3 rounded-lg border border-border bg-white text-sm text-gray-600 hover:bg-gray-50 transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none">Reset</button>
      </div>

      {selectedIds.size > 0 && (
        <div className="flex items-center gap-3 mb-4 px-4 py-3 bg-indigo-50 rounded-xl border border-indigo-200">
          <span className="text-sm font-medium text-indigo-700">{selectedIds.size} course dipilih</span>
          <div className="flex gap-2 ml-auto">
            <button onClick={() => handleBulkAction('publish')} disabled={actionLoading === 'bulk'} className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs font-medium hover:bg-green-700 disabled:opacity-50 transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none">
              {actionLoading === 'bulk' ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />} Publish
            </button>
            <button onClick={() => handleBulkAction('draft')} disabled={actionLoading === 'bulk'} className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 text-white rounded-lg text-xs font-medium hover:bg-amber-700 disabled:opacity-50 transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none">
              {actionLoading === 'bulk' ? <Loader2 className="w-3 h-3 animate-spin" /> : <FileEdit className="w-3 h-3" />} Draft
            </button>
            <button onClick={() => handleBulkAction('delete')} disabled={actionLoading === 'bulk'} className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 text-white rounded-lg text-xs font-medium hover:bg-red-700 disabled:opacity-50 transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none">
              {actionLoading === 'bulk' ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />} Hapus
            </button>
          </div>
        </div>
      )}

      {visibleCourses.length === 0 ? (
        <EmptyState title="Tidak ada course" description="Belum ada course yang sesuai dengan filter." action={search || statusFilter !== 'all' || categoryFilter !== 'all' || levelFilter !== 'all' ? { label: 'Reset Filter', onClick: resetFilters } : { label: 'Tambah Course', onClick: openAddModal }} />
      ) : (
        <>
          <div className="bg-white rounded-xl border border-border overflow-x-auto">
            <div className="hidden xl:grid grid-cols-[32px_2.5fr_1fr_1fr_1.5fr_80px_100px_100px_80px_120px] gap-2 p-4 bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider items-center">
              <div><input type="checkbox" checked={visibleCourses.length > 0 && selectedIds.size === visibleCourses.length} onChange={(e) => selectAll(e.target.checked)} className="accent-indigo-600 outline-none" /></div>
              <span>Judul</span><span>Kategori</span><span>Level</span><span>Instruktur</span><span className="text-center">Siswa</span><span className="text-center">Harga</span><span className="text-center">Revenue</span><span className="text-center">Status</span><span className="text-center">Aksi</span>
            </div>
            <div className="divide-y divide-black/10">
              {visibleCourses.map((course) => {
                const isSelected = selectedIds.has(course.id)
                const isDeleting = actionLoading === course.id
                return (
                  <div key={course.id} className={`${isSelected ? 'bg-indigo-50/50' : ''}`}>
                    <div className="block xl:hidden bg-white rounded-xl border border-border p-3 mx-3 my-2 shadow-sm">
                      <div className="flex items-start gap-3">
                        <input type="checkbox" checked={isSelected} onChange={() => toggleSelect(course.id)} className="accent-indigo-600 outline-none mt-1" />
                        <div className="flex items-start gap-3 min-w-0 flex-1">
                          <ImageWithFallback src={course.thumbnail} alt={course.title} className="w-14 h-10 rounded-lg object-cover flex-shrink-0" />
                          <div className="min-w-0 flex-1">
                            <p className="text-gray-900 font-medium truncate">{course.title}</p>
                            <p className="text-xs text-gray-500 line-clamp-1">{course.description}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 mt-2 ml-7">
                        <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium text-white ${getCategoryColor(course.category)}`}>{course.category}</span>
                        <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${getLevelColor(course.level)}`}>{course.level}</span>
                        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${course.status === 'Published' ? 'bg-green-500 text-white' : 'bg-gray-400 text-white'}`}>{course.status ?? 'Draft'}</span>
                        <span className="text-xs text-gray-500 ml-auto">{course.isFree ? 'Gratis' : formatRupiah(course.price)}</span>
                      </div>
                      <div className="flex items-center justify-end gap-1 mt-2 border-t border-border pt-2">
                        <button onClick={() => openEditModal(course)} className="p-1.5 text-gray-400 hover:text-indigo-600 outline-none rounded" aria-label="Edit"><Edit3 className="w-4 h-4" /></button>
                        <button className="p-1.5 text-gray-400 hover:text-blue-600 outline-none rounded" aria-label="Preview"><Eye className="w-4 h-4" /></button>
                        <button onClick={() => setDeleteTarget(course)} disabled={isDeleting} className="p-1.5 text-gray-400 hover:text-red-500 outline-none rounded disabled:opacity-50" aria-label="Hapus">
                          {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <div className={`hidden xl:grid grid-cols-[32px_2.5fr_1fr_1fr_1.5fr_80px_100px_100px_80px_120px] gap-2 p-4 items-center text-sm`}>
                      <input type="checkbox" checked={isSelected} onChange={() => toggleSelect(course.id)} className="accent-indigo-600 outline-none" />
                      <div className="flex items-start gap-3 min-w-0">
                        <ImageWithFallback src={course.thumbnail} alt={course.title} className="w-14 h-10 rounded-lg object-cover flex-shrink-0" />
                        <div className="min-w-0"><p className="text-gray-900 font-medium truncate">{course.title}</p><p className="text-xs text-gray-500 line-clamp-1 mt-0.5">{course.description}</p></div>
                      </div>
                      <span className={`inline-block w-max px-2 py-0.5 rounded text-xs font-medium text-white ${getCategoryColor(course.category)}`}>{course.category}</span>
                      <span className={`inline-block w-max px-2 py-0.5 rounded text-xs font-medium ${getLevelColor(course.level)}`}>{course.level}</span>
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-600 text-xs font-semibold flex items-center justify-center flex-shrink-0">
                          {course.instructorAvatar ? <img src={course.instructorAvatar} alt="" className="w-7 h-7 rounded-full object-cover" /> : getInitials(course.instructor)}
                        </div>
                        <span className="text-gray-700 truncate">{course.instructor}</span>
                      </div>
                      <span className="text-gray-500 text-center">{course.totalStudents.toLocaleString()}</span>
                      <span className="font-medium text-gray-900 text-center">{course.isFree ? 'Gratis' : formatRupiah(course.price)}</span>
                      <span className="text-gray-500 text-center">{course.revenue ? formatRupiahShort(course.revenue) : '-'}</span>
                      <div className="flex justify-center">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${course.status === 'Published' ? 'bg-green-500 text-white' : 'bg-gray-400 text-white'}`}>{course.status ?? 'Draft'}</span>
                      </div>
                      <div className="flex items-center justify-center gap-1">
                        <button onClick={() => openEditModal(course)} className="p-1.5 text-gray-400 hover:text-indigo-600 outline-none rounded" aria-label="Edit"><Edit3 className="w-4 h-4" /></button>
                        <button className="p-1.5 text-gray-400 hover:text-blue-600 outline-none rounded" aria-label="Preview"><Eye className="w-4 h-4" /></button>
                        <button onClick={() => setDeleteTarget(course)} disabled={isDeleting} className="p-1.5 text-gray-400 hover:text-red-500 outline-none rounded disabled:opacity-50" aria-label="Hapus">
                          {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 text-sm text-gray-500">
            <span>Menampilkan {Math.min((page - 1) * perPage + 1, filtered.length)}-{Math.min(page * perPage, filtered.length)} dari {filtered.length} course</span>
            <div className="flex items-center gap-1">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1} className="px-3 py-1.5 rounded-lg border border-border bg-white text-sm hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed outline-none">Prev</button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1).reduce<(number | 'ellipsis')[]>((acc, p, idx, arr) => { if (idx > 0 && p - arr[idx - 1] > 1) acc.push('ellipsis'); acc.push(p); return acc }, []).map((p, idx) =>
                p === 'ellipsis' ? <span key={`e-${idx}`} className="px-2 text-gray-400">...</span> : (
                  <button key={p} onClick={() => setPage(p)} className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors outline-none ${page === p ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>{p}</button>
                )
              )}
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages} className="px-3 py-1.5 rounded-lg border border-border bg-white text-sm hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed outline-none">Next</button>
            </div>
          </div>
        </>
      )}

      {modalOpen && (
        <CourseFormModal editingCourse={editingCourse} saving={saving} onSave={handleSave} onClose={() => setModalOpen(false)} />
      )}

      {deleteTarget && (
        <CourseDeleteDialog course={deleteTarget} loading={actionLoading === deleteTarget.id} onConfirm={() => handleDelete(deleteTarget.id)} onCancel={() => setDeleteTarget(null)} />
      )}
    </div>
  )
}