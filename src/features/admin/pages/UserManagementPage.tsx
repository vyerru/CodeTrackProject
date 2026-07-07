import { useState, useMemo, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Search, Plus, Edit3, Trash2, Eye, X, Check,
  Loader2, Users, UserCheck, Shield, UserPlus,
  AlertTriangle, BookOpen, Clock, Award, Flame, Activity,
  Ban,
} from 'lucide-react'
import { useAsync } from '@/shared/hooks/useAsync'
import { repos } from '@/core/domain/di'
import { getRelativeTime } from '@/shared/utils'
import type { User, UserRole, UserDetail } from '@/shared/types'
import type { CreateUserParams, UpdateUserParams } from '@/core/domain/repositories/IUserRepository'
import ErrorState from '@/shared/components/common/ErrorState'
import LoadingSpinner from '@/shared/components/common/LoadingSpinner'
import EmptyState from '@/shared/components/common/EmptyState'

const userSchema = z
  .object({
    name: z.string().min(2, 'Nama minimal 2 karakter'),
    email: z.string().email('Email tidak valid'),
    role: z.enum(['student', 'instructor', 'admin']),
    status: z.enum(['Active', 'Inactive']),
    password: z.string().min(6, 'Password minimal 6 karakter').optional().or(z.literal('')),
    confirmPassword: z.string().optional().or(z.literal('')),
    avatar: z.string().url('URL tidak valid').or(z.literal('')).optional(),
  })
  .refine(
    (data) => {
      if (!data.password && !data.confirmPassword) return true
      return data.password === data.confirmPassword
    },
    { message: 'Password tidak cocok', path: ['confirmPassword'] }
  )

type UserFormData = z.infer<typeof userSchema>

const perPage = 5

function getInitials(name: string) {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
}

function getRoleBadgeClass(role: UserRole): string {
  switch (role) {
    case 'student': return 'border border-gray-300 text-gray-600'
    case 'instructor': return 'bg-blue-500 text-white'
    case 'admin': return 'bg-indigo-500 text-white'
  }
}

function getStatusBadgeClass(status: string): string {
  return status === 'Active' ? 'bg-green-500 text-white' : 'bg-gray-400 text-white'
}

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

    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(
        (u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
      )
    }

    if (roleFilter !== 'all') {
      result = result.filter((u) => u.role === roleFilter)
    }

    if (statusFilter !== 'all') {
      result = result.filter((u) => u.status === statusFilter)
    }

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
      newThisMonth: users.filter((u) => {
        const d = new Date(u.createdAt)
        const now = new Date()
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
      }).length,
    }
  }, [users])

  const resetFilters = useCallback(() => {
    setSearch('')
    setRoleFilter('all')
    setStatusFilter('all')
    setPage(1)
  }, [])

  const selectAll = useCallback(
    (checked: boolean) => {
      if (checked) setSelectedIds(new Set(visibleUsers.map((u) => u.id)))
      else setSelectedIds(new Set())
    },
    [visibleUsers]
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

  const openEditModal = (user: User) => {
    setEditingId(user.id)
    setModalOpen(true)
  }

  const openDetailModal = async (user: User) => {
    setDetailLoading(true)
    try {
      const detail = await repos.user.getUserDetail(user.id)
      if (detail) setDetailTarget(detail)
    } finally {
      setDetailLoading(false)
    }
  }

  const handleSave = async (data: UserFormData) => {
    setSaving(true)
    try {
      if (editingId) {
        const params: UpdateUserParams = {
          name: data.name,
          email: data.email,
          role: data.role,
          status: data.status,
          avatar: data.avatar || null,
        }
        await repos.user.update(editingId, params)
      } else {
        const params: CreateUserParams = {
          name: data.name,
          email: data.email,
          password: data.password ?? '',
          role: data.role,
          status: data.status,
          avatar: data.avatar || undefined,
        }
        await repos.user.create(params)
      }
      setModalOpen(false)
      refetch()
    } finally {
      setSaving(false)
    }
  }

  const handleSuspend = async (id: string) => {
    setActionLoading(id)
    try {
      await repos.user.update(id, { status: 'Inactive' })
      setSuspendTarget(null)
      refetch()
    } finally {
      setActionLoading(null)
    }
  }

  const handleDelete = async (id: string) => {
    setActionLoading(id)
    try {
      await repos.user.delete(id)
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

  const handleBulkAction = async (action: 'activate' | 'suspend' | 'delete') => {
    setActionLoading('bulk')
    try {
      for (const id of selectedIds) {
        if (action === 'delete') {
          await repos.user.delete(id)
        } else {
          await repos.user.update(id, {
            status: action === 'activate' ? 'Active' : 'Inactive',
          })
        }
      }
      setSelectedIds(new Set())
      refetch()
    } finally {
      setActionLoading(null)
    }
  }

  const editingUser = useMemo(() => {
    if (!editingId || !users) return null
    return users.find((u) => u.id === editingId) ?? null
  }, [editingId, users])

  if (isLoading) return <LoadingSpinner fullPage />
  if (error) return <ErrorState message={error} onRetry={refetch} />

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-xl font-bold text-gray-900">Kelola Pengguna</h1>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none"
        >
          <Plus className="w-4 h-4" />
          Tambah Pengguna
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-border p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
              <Users className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              <p className="text-xs text-gray-500">Total Pengguna</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-border p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <UserCheck className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.student}</p>
              <p className="text-xs text-gray-500">Student</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-border p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.instructor}</p>
              <p className="text-xs text-gray-500">Instructor</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-border p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <Shield className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.admin}</p>
              <p className="text-xs text-gray-500">Admin</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-border p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.newThisMonth}</p>
              <p className="text-xs text-gray-500">Bulan Ini</p>
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
            placeholder="Cari nama atau email..."
            className="w-full h-9 pl-10 pr-3 rounded-lg border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => { setRoleFilter(e.target.value as typeof roleFilter); setPage(1) }}
          className="h-9 px-3 rounded-lg border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="all">Semua Role</option>
          <option value="student">Student</option>
          <option value="instructor">Instructor</option>
          <option value="admin">Admin</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value as typeof statusFilter); setPage(1) }}
          className="h-9 px-3 rounded-lg border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="all">Semua Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
        <button
          onClick={resetFilters}
          className="h-9 px-3 rounded-lg border border-border bg-white text-sm text-gray-600 hover:bg-gray-50 transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none"
        >
          Reset
        </button>
      </div>

      {selectedIds.size > 0 && (
        <div className="flex items-center gap-3 mb-4 px-4 py-3 bg-indigo-50 rounded-xl border border-indigo-200">
          <span className="text-sm font-medium text-indigo-700">
            {selectedIds.size} pengguna dipilih
          </span>
          <div className="flex gap-2 ml-auto">
            <button
              onClick={() => handleBulkAction('activate')}
              disabled={actionLoading === 'bulk'}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs font-medium hover:bg-green-700 disabled:opacity-50 transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none"
            >
              {actionLoading === 'bulk' ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
              Aktifkan
            </button>
            <button
              onClick={() => handleBulkAction('suspend')}
              disabled={actionLoading === 'bulk'}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 text-white rounded-lg text-xs font-medium hover:bg-amber-700 disabled:opacity-50 transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none"
            >
              {actionLoading === 'bulk' ? <Loader2 className="w-3 h-3 animate-spin" /> : <Ban className="w-3 h-3" />}
              Suspend
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

      {visibleUsers.length === 0 ? (
        <EmptyState
          title="Tidak ada pengguna"
          description="Belum ada pengguna yang sesuai dengan filter."
          action={search || roleFilter !== 'all' || statusFilter !== 'all' ? { label: 'Reset Filter', onClick: resetFilters } : { label: 'Tambah Pengguna', onClick: openAddModal }}
        />
      ) : (
        <>
          <div className="bg-white rounded-xl border border-border overflow-hidden">
            <div className="hidden lg:grid grid-cols-[32px_2fr_1fr_1fr_1fr_80px_120px_120px] gap-3 p-4 bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider items-center">
              <div>
                <input
                  type="checkbox"
                  checked={visibleUsers.length > 0 && selectedIds.size === visibleUsers.length}
                  onChange={(e) => selectAll(e.target.checked)}
                  className="accent-indigo-600 focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none"
                />
              </div>
              <span>Pengguna</span>
              <span>Role</span>
              <span>Status</span>
              <span>Tanggal Daftar</span>
              <span className="text-center">Course</span>
              <span>Terakhir Aktif</span>
              <span className="text-center">Aksi</span>
            </div>
            <div className="divide-y divide-black/10">
              {visibleUsers.map((user) => {
                const isSelected = selectedIds.has(user.id)
                const isDeleting = actionLoading === user.id
                return (
                  <div
                    key={user.id}
                    className={`grid grid-cols-1 lg:grid-cols-[32px_2fr_1fr_1fr_1fr_80px_120px_120px] gap-3 p-4 items-center text-sm ${
                      isSelected ? 'bg-indigo-50/50' : ''
                    }`}
                  >
                    <div className="flex lg:hidden items-center gap-3 mb-2">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelect(user.id)}
                        className="accent-indigo-600 focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none"
                      />
                    </div>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelect(user.id)}
                      className="hidden lg:block accent-indigo-600 focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none"
                    />
                    <div className="flex items-center gap-3 min-w-0">
                      {user.avatar ? (
                        <img src={user.avatar} alt="" className="w-9 h-9 rounded-full object-cover flex-shrink-0" />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-600 text-xs font-semibold flex items-center justify-center flex-shrink-0">
                          {getInitials(user.name)}
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="text-gray-900 font-medium truncate">{user.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      </div>
                    </div>
                    <span className={`inline-block w-max px-2 py-0.5 rounded text-xs font-medium ${getRoleBadgeClass(user.role)}`}>
                      {user.role}
                    </span>
                    <span className={`inline-block w-max px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(user.status ?? 'Active')}`}>
                      {user.status ?? 'Active'}
                    </span>
                    <span className="text-gray-500">{new Date(user.createdAt).toLocaleDateString('id-ID')}</span>
                    <span className="text-gray-500 text-center">{user.role === 'student' ? (user.courseEnrolled ?? 0) : '-'}</span>
                    <span className="text-gray-500 text-xs">
                      {user.lastActive ? getRelativeTime(user.lastActive) : '-'}
                    </span>
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => openEditModal(user)}
                        className="p-1.5 text-gray-400 hover:text-indigo-600 transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none rounded"
                        title="Edit"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openDetailModal(user)}
                        className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none rounded"
                        title="Lihat Detail"
                      >
                        {detailLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Eye className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => setSuspendTarget(user)}
                        className="p-1.5 text-gray-400 hover:text-amber-500 transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none rounded"
                        title="Suspend"
                      >
                        <Ban className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(user)}
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
              Menampilkan {Math.min((page - 1) * perPage + 1, filtered.length)}-{Math.min(page * perPage, filtered.length)} dari {filtered.length} pengguna
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="px-3 py-1.5 rounded-lg border border-border bg-white text-sm hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none"
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
                className="px-3 py-1.5 rounded-lg border border-border bg-white text-sm hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}

      {modalOpen && (
        <UserFormModal
          editingUser={editingUser}
          saving={saving}
          onSave={handleSave}
          onClose={() => setModalOpen(false)}
        />
      )}

      {detailTarget && (
        <UserDetailModal
          user={detailTarget}
          onClose={() => setDetailTarget(null)}
        />
      )}

      {suspendTarget && (
        <SuspendConfirmDialog
          user={suspendTarget}
          loading={actionLoading === suspendTarget.id}
          onConfirm={() => handleSuspend(suspendTarget.id)}
          onCancel={() => setSuspendTarget(null)}
        />
      )}

      {deleteTarget && (
        <DeleteConfirmDialog
          user={deleteTarget}
          loading={actionLoading === deleteTarget.id}
          onConfirm={() => handleDelete(deleteTarget.id)}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  )
}

function UserFormModal({
  editingUser,
  saving,
  onSave,
  onClose,
}: {
  editingUser: User | null
  saving: boolean
  onSave: (data: UserFormData) => Promise<void>
  onClose: () => void
}) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: editingUser?.name ?? '',
      email: editingUser?.email ?? '',
      role: editingUser?.role ?? 'student',
      status: (editingUser?.status as 'Active' | 'Inactive') ?? 'Active',
      password: '',
      confirmPassword: '',
      avatar: editingUser?.avatar ?? '',
    },
  })

  const isEditing = !!editingUser

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-8 overflow-y-auto bg-black/50" onClick={onClose}>
      <div
        className="w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-lg font-semibold text-gray-900">
            {isEditing ? 'Edit Pengguna' : 'Tambah Pengguna'}
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
            <input
              {...register('name')}
              placeholder="Masukkan nama lengkap"
              className="w-full h-9 px-3 rounded-lg border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              {...register('email')}
              type="email"
              placeholder="nama@email.com"
              className="w-full h-9 px-3 rounded-lg border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <select
                {...register('role')}
                className="w-full h-9 px-3 rounded-lg border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="student">Student</option>
                <option value="instructor">Instructor</option>
                <option value="admin">Admin</option>
              </select>
              {errors.role && <p className="text-xs text-red-500 mt-1">{errors.role.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <div className="flex gap-2 h-9 items-center">
                <button
                  type="button"
                  onClick={() => setValue('status', 'Active')}
                  className={`flex-1 h-full rounded-lg text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none ${
                    watch('status') === 'Active'
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Active
                </button>
                <button
                  type="button"
                  onClick={() => setValue('status', 'Inactive')}
                  className={`flex-1 h-full rounded-lg text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none ${
                    watch('status') === 'Inactive'
                      ? 'bg-gray-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Inactive
                </button>
              </div>
            </div>
          </div>

          {!isEditing && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  {...register('password')}
                  type="password"
                  placeholder="Minimal 6 karakter"
                  className="w-full h-9 px-3 rounded-lg border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Konfirmasi Password</label>
                <input
                  {...register('confirmPassword')}
                  type="password"
                  placeholder="Ulangi password"
                  className="w-full h-9 px-3 rounded-lg border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword.message}</p>}
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Avatar URL (opsional)</label>
            <input
              {...register('avatar')}
              placeholder="https://example.com/avatar.jpg"
              className="w-full h-9 px-3 rounded-lg border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {errors.avatar && <p className="text-xs text-red-500 mt-1">{errors.avatar.message}</p>}
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

function UserDetailModal({
  user,
  onClose,
}: {
  user: UserDetail
  onClose: () => void
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-8 overflow-y-auto bg-black/50" onClick={onClose}>
      <div
        className="w-full max-w-xl bg-white rounded-2xl shadow-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-lg font-semibold text-gray-900">Detail Pengguna</h2>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          <div className="flex items-center gap-4">
            {user.avatar ? (
              <img src={user.avatar} alt="" className="w-16 h-16 rounded-full object-cover" />
            ) : (
              <div className="w-16 h-16 rounded-full bg-indigo-100 text-indigo-600 text-xl font-semibold flex items-center justify-center">
                {getInitials(user.name)}
              </div>
            )}
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
              <p className="text-sm text-gray-500">{user.email}</p>
              <div className="flex gap-2 mt-1.5">
                <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${getRoleBadgeClass(user.role)}`}>
                  {user.role}
                </span>
                <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(user.status ?? 'Active')}`}>
                  {user.status ?? 'Active'}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-gray-500">Tanggal Daftar</p>
              <p className="font-medium text-gray-900">{new Date(user.createdAt).toLocaleDateString('id-ID')}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-gray-500">Terakhir Aktif</p>
              <p className="font-medium text-gray-900">{user.lastActive ? getRelativeTime(user.lastActive) : '-'}</p>
            </div>
          </div>

          {user.role === 'student' && (
            <>
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-blue-50 rounded-lg p-3 text-center">
                  <Clock className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                  <p className="text-lg font-bold text-blue-700">{user.totalLearningTime ?? 0}h</p>
                  <p className="text-xs text-blue-600">Total Belajar</p>
                </div>
                <div className="bg-green-50 rounded-lg p-3 text-center">
                  <Award className="w-5 h-5 text-green-600 mx-auto mb-1" />
                  <p className="text-lg font-bold text-green-700">{user.certificatesEarned ?? 0}</p>
                  <p className="text-xs text-green-600">Sertifikat</p>
                </div>
                <div className="bg-amber-50 rounded-lg p-3 text-center">
                  <Flame className="w-5 h-5 text-amber-600 mx-auto mb-1" />
                  <p className="text-lg font-bold text-amber-700">{user.currentStreak ?? 0} hr</p>
                  <p className="text-xs text-amber-600">Streak</p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  Course yang Di-enroll
                </h4>
                <div className="space-y-2">
                  {user.enrolledCourses?.map((course, i) => (
                    <div key={i} className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-900 truncate">{course.title}</span>
                        <span className="text-xs text-gray-500 ml-2">{course.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div
                          className="bg-indigo-600 h-1.5 rounded-full transition-all"
                          style={{ width: `${course.progress}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  Aktivitas Terbaru
                </h4>
                <div className="space-y-1">
                  {user.recentActivities?.map((act, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm py-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-gray-700 truncate">{act.title}</p>
                        <p className="text-xs text-gray-400">{act.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        <div className="px-6 py-4 border-t border-border flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-border rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  )
}

function SuspendConfirmDialog({
  user,
  loading,
  onConfirm,
  onCancel,
}: {
  user: User
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
          <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900">Suspend Pengguna</h2>
        </div>
        <p className="text-sm text-gray-600 mb-1">
          Apakah Anda yakin ingin menonaktifkan akun pengguna berikut?
        </p>
        <p className="text-sm font-medium text-gray-900 mb-6 bg-amber-50 rounded-lg p-3 border border-amber-200">
          &ldquo;{user.name}&rdquo; ({user.email})
        </p>
        <p className="text-xs text-amber-600 mb-4">
          Pengguna tidak akan bisa login sampai diaktifkan kembali.
        </p>
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 border border-border rounded-lg text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="px-4 py-2 bg-amber-600 text-white rounded-lg text-sm font-medium hover:bg-amber-700 disabled:opacity-60 flex items-center gap-2 transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading ? 'Memproses...' : 'Suspend'}
          </button>
        </div>
      </div>
    </div>
  )
}

function DeleteConfirmDialog({
  user,
  loading,
  onConfirm,
  onCancel,
}: {
  user: User
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
          <h2 className="text-lg font-semibold text-gray-900">Hapus Pengguna</h2>
        </div>
        <p className="text-sm text-gray-600 mb-1">
          Apakah Anda yakin ingin menghapus akun pengguna berikut? Tindakan ini tidak bisa dibatalkan.
        </p>
        <p className="text-sm font-medium text-gray-900 mb-6 bg-red-50 rounded-lg p-3 border border-red-200">
          &ldquo;{user.name}&rdquo; ({user.email})
        </p>
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 border border-border rounded-lg text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none"
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