import { useState, useMemo, useCallback } from 'react'
import {
  Search, Plus, Edit3, Trash2, Eye, Check,
  Loader2, Users, UserCheck, Shield, UserPlus, Ban,
  BookOpen,
} from 'lucide-react'
import { useAsync } from '@/shared/hooks/useAsync'
import { repos } from '@/core/domain/di'
import { getRelativeTime } from '@/shared/utils'
import type { User, UserRole, UserDetail } from '@/shared/types'
import ErrorState from '@/shared/components/common/ErrorState'
import EmptyState from '@/shared/components/common/EmptyState'
import UserFormModal from '@/features/admin/components/UserFormModal'
import type { UserFormData } from '@/features/admin/components/UserFormModal'
import UserDetailModal from '@/features/admin/components/UserDetailModal'
import UserSuspendDialog from '@/features/admin/components/UserSuspendDialog'
import UserDeleteDialog from '@/features/admin/components/UserDeleteDialog'
import ManagementPageSkeleton from '@/features/admin/components/ManagementPageSkeleton'
import { getInitials, getRoleBadgeClass, getStatusBadgeClass } from '@/features/admin/components/admin-helpers'

const perPage = 5

export default function UserManagementPage() {
  const { data: users, isLoading, error, refetch } = useAsync<User[]>(
    () => repos.user.findAll()
  )

  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState<'all' | UserRole>('all')
  const [statusFilter, setStatusFilter] = useState<'all' | 'Active' | 'Inactive'>('all')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [page, setPage] = useState(1)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [detailTarget, setDetailTarget] = useState<UserDetail | null>(null)
  const [detailLoading, setDetailLoading] = useState(false)
  const [suspendTarget, setSuspendTarget] = useState<User | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null)
  const [saving, setSaving] = useState(false)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const filtered = useMemo(() => {
    if (!users) return []
    let result = users
    if (search.trim()) { const q = search.toLowerCase(); result = result.filter((u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)) }
    if (roleFilter !== 'all') result = result.filter((u) => u.role === roleFilter)
    if (statusFilter !== 'all') result = result.filter((u) => u.status === statusFilter)
    return result
  }, [users, search, roleFilter, statusFilter])

  const totalPages = Math.ceil(filtered.length / perPage)
  const visibleUsers = filtered.slice((page - 1) * perPage, page * perPage)

  const stats = useMemo(() => {
    if (!users) return { total: 0, student: 0, instructor: 0, admin: 0, newThisMonth: 0 }
    return {
      total: users.length,
      student: users.filter((u) => u.role === 'student').length,
      instructor: users.filter((u) => u.role === 'instructor').length,
      admin: users.filter((u) => u.role === 'admin').length,
      newThisMonth: users.filter((u) => { const d = new Date(u.createdAt); const n = new Date(); return d.getMonth() === n.getMonth() && d.getFullYear() === n.getFullYear() }).length,
    }
  }, [users])

  const resetFilters = useCallback(() => { setSearch(''); setRoleFilter('all'); setStatusFilter('all'); setPage(1) }, [])
  const selectAll = useCallback((checked: boolean) => { setSelectedIds(checked ? new Set(visibleUsers.map((u) => u.id)) : new Set()) }, [visibleUsers])
  const toggleSelect = useCallback((id: string) => setSelectedIds((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n }), [])

  const openAddModal = () => { setEditingId(null); setModalOpen(true) }
  const openEditModal = (user: User) => { setEditingId(user.id); setModalOpen(true) }
  const openDetailModal = async (user: User) => {
    setDetailLoading(true)
    try { const d = await repos.user.getUserDetail(user.id); if (d) setDetailTarget(d) }
    finally { setDetailLoading(false) }
  }

  const handleSave = async (data: UserFormData) => {
    setSaving(true)
    try {
      if (editingId) await repos.user.update(editingId, { name: data.name, email: data.email, role: data.role, status: data.status, avatar: data.avatar || null })
      else await repos.user.create({ name: data.name, email: data.email, password: data.password ?? '', role: data.role, status: data.status, avatar: data.avatar || undefined })
      setModalOpen(false); refetch()
    } finally { setSaving(false) }
  }

  const handleSuspend = async (id: string) => {
    setActionLoading(id)
    try { await repos.user.update(id, { status: 'Inactive' }); setSuspendTarget(null); refetch() }
    finally { setActionLoading(null) }
  }

  const handleDelete = async (id: string) => {
    setActionLoading(id)
    try { await repos.user.delete(id); setDeleteTarget(null); setSelectedIds((prev) => { const n = new Set(prev); n.delete(id); return n }); refetch() }
    finally { setActionLoading(null) }
  }

  const handleBulkAction = async (action: 'activate' | 'suspend' | 'delete') => {
    setActionLoading('bulk')
    try {
      for (const id of selectedIds) {
        if (action === 'delete') await repos.user.delete(id)
        else await repos.user.update(id, { status: action === 'activate' ? 'Active' : 'Inactive' })
      }
      setSelectedIds(new Set()); refetch()
    } finally { setActionLoading(null) }
  }

  const editingUser = useMemo(() => {
    if (!editingId || !users) return null
    return users.find((u) => u.id === editingId) ?? null
  }, [editingId, users])

  if (isLoading) return <ManagementPageSkeleton statCount={5} />
  if (error) return <ErrorState message={error} onRetry={refetch} />

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-xl font-bold text-gray-900">Kelola Pengguna</h1>
        <button onClick={openAddModal} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none">
          <Plus className="w-4 h-4" /> Tambah Pengguna
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-6">
        {[
          { icon: Users, bg: 'bg-indigo-100', color: 'text-indigo-600', label: 'Total Pengguna', value: stats.total },
          { icon: UserCheck, bg: 'bg-green-100', color: 'text-green-600', label: 'Student', value: stats.student },
          { icon: BookOpen, bg: 'bg-blue-100', color: 'text-blue-600', label: 'Instructor', value: stats.instructor },
          { icon: Shield, bg: 'bg-purple-100', color: 'text-purple-600', label: 'Admin', value: stats.admin },
          { icon: UserPlus, bg: 'bg-amber-100', color: 'text-amber-600', label: 'Bulan Ini', value: stats.newThisMonth },
        ].map((card, i) => {
          const Icon = card.icon
          return (
            <div key={i} className="bg-white rounded-xl border border-border p-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg ${card.bg} flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${card.color}`} />
                </div>
                <div><p className="text-2xl font-bold text-gray-900">{card.value}</p><p className="text-xs text-gray-500">{card.label}</p></div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari nama atau email..." className="w-full h-9 pl-10 pr-3 rounded-lg border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
        <select value={roleFilter} onChange={(e) => { setRoleFilter(e.target.value as typeof roleFilter); setPage(1) }} className="h-9 px-3 rounded-lg border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
          <option value="all">Semua Role</option>
          <option value="student">Student</option>
          <option value="instructor">Instructor</option>
          <option value="admin">Admin</option>
        </select>
        <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value as typeof statusFilter); setPage(1) }} className="h-9 px-3 rounded-lg border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
          <option value="all">Semua Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
        <button onClick={resetFilters} className="h-9 px-3 rounded-lg border border-border bg-white text-sm text-gray-600 hover:bg-gray-50 transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none">Reset</button>
      </div>

      {selectedIds.size > 0 && (
        <div className="flex items-center gap-3 mb-4 px-4 py-3 bg-indigo-50 rounded-xl border border-indigo-200">
          <span className="text-sm font-medium text-indigo-700">{selectedIds.size} pengguna dipilih</span>
          <div className="flex gap-2 ml-auto">
            <button onClick={() => handleBulkAction('activate')} disabled={actionLoading === 'bulk'} className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs font-medium hover:bg-green-700 disabled:opacity-50 transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none">
              {actionLoading === 'bulk' ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />} Aktifkan
            </button>
            <button onClick={() => handleBulkAction('suspend')} disabled={actionLoading === 'bulk'} className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 text-white rounded-lg text-xs font-medium hover:bg-amber-700 disabled:opacity-50 transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none">
              {actionLoading === 'bulk' ? <Loader2 className="w-3 h-3 animate-spin" /> : <Ban className="w-3 h-3" />} Suspend
            </button>
            <button onClick={() => handleBulkAction('delete')} disabled={actionLoading === 'bulk'} className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 text-white rounded-lg text-xs font-medium hover:bg-red-700 disabled:opacity-50 transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none">
              {actionLoading === 'bulk' ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />} Hapus
            </button>
          </div>
        </div>
      )}

      {visibleUsers.length === 0 ? (
        <EmptyState title="Tidak ada pengguna" description="Belum ada pengguna yang sesuai dengan filter." action={search || roleFilter !== 'all' || statusFilter !== 'all' ? { label: 'Reset Filter', onClick: resetFilters } : { label: 'Tambah Pengguna', onClick: openAddModal }} />
      ) : (
        <>
          <div className="bg-white rounded-xl border border-border overflow-x-auto">
            <div className="hidden lg:grid grid-cols-[32px_2fr_1fr_1fr_1fr_80px_120px_120px] gap-3 p-4 bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider items-center">
              <div><input type="checkbox" checked={visibleUsers.length > 0 && selectedIds.size === visibleUsers.length} onChange={(e) => selectAll(e.target.checked)} className="accent-indigo-600 outline-none" /></div>
              <span>Pengguna</span><span>Role</span><span>Status</span><span>Tanggal Daftar</span><span className="text-center">Course</span><span>Terakhir Aktif</span><span className="text-center">Aksi</span>
            </div>
            <div className="divide-y divide-black/10">
              {visibleUsers.map((user) => {
                const isSelected = selectedIds.has(user.id)
                const isDeleting = actionLoading === user.id
                return (
                  <div key={user.id} className={`grid grid-cols-1 lg:grid-cols-[32px_2fr_1fr_1fr_1fr_80px_120px_120px] gap-3 p-4 items-center text-sm ${isSelected ? 'bg-indigo-50/50' : ''}`}>
                    <div className="flex lg:hidden items-center gap-3 mb-2"><input type="checkbox" checked={isSelected} onChange={() => toggleSelect(user.id)} className="accent-indigo-600 outline-none" /></div>
                    <input type="checkbox" checked={isSelected} onChange={() => toggleSelect(user.id)} className="hidden lg:block accent-indigo-600 outline-none" />
                    <div className="flex items-center gap-3 min-w-0">
                      {user.avatar ? <img src={user.avatar} alt="" className="w-9 h-9 rounded-full object-cover flex-shrink-0" /> : <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-600 text-xs font-semibold flex items-center justify-center flex-shrink-0">{getInitials(user.name)}</div>}
                      <div className="min-w-0"><p className="text-gray-900 font-medium truncate">{user.name}</p><p className="text-xs text-gray-500 truncate">{user.email}</p></div>
                    </div>
                    <span className={`inline-block w-max px-2 py-0.5 rounded text-xs font-medium ${getRoleBadgeClass(user.role)}`}>{user.role}</span>
                    <span className={`inline-block w-max px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(user.status ?? 'Active')}`}>{user.status ?? 'Active'}</span>
                    <span className="text-gray-500">{new Date(user.createdAt).toLocaleDateString('id-ID')}</span>
                    <span className="text-gray-500 text-center">{user.role === 'student' ? (user.courseEnrolled ?? 0) : '-'}</span>
                    <span className="text-gray-500 text-xs">{user.lastActive ? getRelativeTime(user.lastActive) : '-'}</span>
                    <div className="flex items-center justify-center gap-1">
                      <button onClick={() => openEditModal(user)} className="p-1.5 text-gray-400 hover:text-indigo-600 transition-colors outline-none rounded" title="Edit"><Edit3 className="w-4 h-4" /></button>
                      <button onClick={() => openDetailModal(user)} className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors outline-none rounded" title="Lihat Detail">
                        {detailLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Eye className="w-4 h-4" />}
                      </button>
                      <button onClick={() => setSuspendTarget(user)} className="p-1.5 text-gray-400 hover:text-amber-500 transition-colors outline-none rounded" title="Suspend"><Ban className="w-4 h-4" /></button>
                      <button onClick={() => setDeleteTarget(user)} disabled={isDeleting} className="p-1.5 text-gray-400 hover:text-red-500 transition-colors outline-none rounded disabled:opacity-50" title="Hapus">
                        {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 text-sm text-gray-500">
            <span>Menampilkan {Math.min((page - 1) * perPage + 1, filtered.length)}-{Math.min(page * perPage, filtered.length)} dari {filtered.length} pengguna</span>
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

      {modalOpen && <UserFormModal editingUser={editingUser} saving={saving} onSave={handleSave} onClose={() => setModalOpen(false)} />}
      {detailTarget && <UserDetailModal user={detailTarget} onClose={() => setDetailTarget(null)} />}
      {suspendTarget && <UserSuspendDialog user={suspendTarget} loading={actionLoading === suspendTarget.id} onConfirm={() => handleSuspend(suspendTarget.id)} onCancel={() => setSuspendTarget(null)} />}
      {deleteTarget && <UserDeleteDialog user={deleteTarget} loading={actionLoading === deleteTarget.id} onConfirm={() => handleDelete(deleteTarget.id)} onCancel={() => setDeleteTarget(null)} />}
    </div>
  )
}