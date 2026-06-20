import { useState, useMemo } from 'react'
import { Search, Edit3, Trash2 } from 'lucide-react'
import { useAsync } from '@/shared/hooks/useAsync'
import { repos } from '@/core/domain/di'
import type { User } from '@/shared/types'
import ErrorState from '@/shared/components/common/ErrorState'
import LoadingSpinner from '@/shared/components/common/LoadingSpinner'

const getInitials = (name: string) =>
  name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)

export default function UserManagementPage() {
  const { data: users, isLoading, error, refetch } = useAsync<User[]>(
    () => repos.user.findAll()
  )
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    if (!users) return []
    if (!search.trim()) return users
    const q = search.toLowerCase()
    return users.filter(u => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q))
  }, [users, search])

  if (isLoading) return <LoadingSpinner />
  if (error) return <ErrorState message={error} onRetry={refetch} />

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-xl font-bold text-gray-900">Kelola Pengguna</h1>
      </div>

      <div className="relative max-w-sm mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari pengguna..."
          className="w-full h-9 pl-10 pr-3 rounded-lg border border-black/10 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div className="bg-white rounded-xl border border-black/10 overflow-hidden">
        <div className="hidden md:grid grid-cols-[2fr_2fr_1fr_1fr_1fr] gap-4 p-4 bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
          <span>Nama</span><span>Email</span><span>Role</span><span>Tanggal Daftar</span><span>Aksi</span>
        </div>
        <div className="divide-y divide-black/10">
          {filtered.map((u) => (
            <div key={u.id} className="grid grid-cols-1 md:grid-cols-[2fr_2fr_1fr_1fr_1fr] gap-2 p-4 items-center text-sm">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 text-xs font-semibold flex items-center justify-center">
                  {getInitials(u.name)}
                </div>
                <span className="text-gray-900 font-medium truncate">{u.name}</span>
              </div>
              <span className="text-gray-500 truncate">{u.email}</span>
              <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                u.role === 'admin' ? 'bg-indigo-500 text-white' : 'border border-gray-300 text-gray-600'
              }`}>
                {u.role}
              </span>
              <span className="text-gray-500">{new Date(u.createdAt).toLocaleDateString('id-ID')}</span>
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
