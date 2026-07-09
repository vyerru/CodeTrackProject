import { useState, useMemo, useCallback } from 'react'
import {
  Search, Download, Edit3, Trash2, Check, X,
  Loader2, Receipt, CheckCheck, Clock, AlertCircle, DollarSign,
} from 'lucide-react'
import { useAsync } from '@/shared/hooks/useAsync'
import { repos } from '@/core/domain/di'
import { formatRupiah, formatRupiahShort, getStatusColor, getRelativeTime } from '@/shared/utils'
import type { Transaction, TransactionStatus } from '@/shared/types'
import ErrorState from '@/shared/components/common/ErrorState'
import EmptyState from '@/shared/components/common/EmptyState'
import ManagementPageSkeleton from '@/features/admin/components/ManagementPageSkeleton'

const perPage = 6

const statusLabels: Record<string, string> = {
  all: 'Semua',
  success: 'Success',
  pending: 'Pending',
  failed: 'Failed',
}

export default function TransactionManagementPage() {
  const { data: transactions, isLoading, error, refetch } = useAsync<Transaction[]>(
    () => repos.transaction.findAll()
  )

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<TransactionStatus | 'all'>('all')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [page, setPage] = useState(1)
  const [editTarget, setEditTarget] = useState<Transaction | null>(null)
  const [editStatus, setEditStatus] = useState<TransactionStatus>('success')
  const [deleteTarget, setDeleteTarget] = useState<Transaction | null>(null)
  const [saving, setSaving] = useState(false)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const filtered = useMemo(() => {
    if (!transactions) return []
    let result = transactions
    if (statusFilter !== 'all') result = result.filter((t) => t.status === statusFilter)
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter((t) =>
        t.invoice.toLowerCase().includes(q) ||
        t.customerName.toLowerCase().includes(q) ||
        t.courseTitle.toLowerCase().includes(q)
      )
    }
    return result
  }, [transactions, search, statusFilter])

  const totalPages = Math.ceil(filtered.length / perPage)
  const visibleTransactions = filtered.slice((page - 1) * perPage, page * perPage)

  const stats = useMemo(() => {
    if (!transactions) return { total: 0, success: 0, pending: 0, failed: 0, totalRevenue: 0 }
    return {
      total: transactions.length,
      success: transactions.filter((t) => t.status === 'success').length,
      pending: transactions.filter((t) => t.status === 'pending').length,
      failed: transactions.filter((t) => t.status === 'failed').length,
      totalRevenue: transactions.reduce((sum, t) => sum + (t.status === 'success' ? t.amount : 0), 0),
    }
  }, [transactions])

  const resetFilters = useCallback(() => { setSearch(''); setStatusFilter('all'); setPage(1) }, [])
  const selectAll = useCallback((checked: boolean) => { setSelectedIds(checked ? new Set(visibleTransactions.map((t) => t.id)) : new Set()) }, [visibleTransactions])
  const toggleSelect = useCallback((id: string) => setSelectedIds((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n }), [])

  const openEditModal = (txn: Transaction) => {
    setEditTarget(txn)
    setEditStatus(txn.status)
  }

  const handleEdit = async () => {
    if (!editTarget) return
    setSaving(true)
    try {
      await repos.transaction.update(editTarget.id, { status: editStatus })
      setEditTarget(null)
      refetch()
    } finally { setSaving(false) }
  }

  const handleDelete = async (id: string) => {
    setActionLoading(id)
    try {
      await repos.transaction.delete(id)
      setDeleteTarget(null)
      setSelectedIds((prev) => { const n = new Set(prev); n.delete(id); return n })
      refetch()
    } finally { setActionLoading(null) }
  }

  const handleBulkAction = async (action: 'success' | 'pending' | 'failed' | 'delete') => {
    setActionLoading('bulk')
    try {
      for (const id of selectedIds) {
        if (action === 'delete') await repos.transaction.delete(id)
        else await repos.transaction.update(id, { status: action })
      }
      setSelectedIds(new Set())
      refetch()
    } finally { setActionLoading(null) }
  }

  if (isLoading) return <ManagementPageSkeleton statCount={5} />
  if (error) return <ErrorState message={error} onRetry={refetch} />

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-xl font-bold text-gray-900">Kelola Transaksi</h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-border rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none">
          <Download className="w-4 h-4" /> Export
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-6">
        {[
          { icon: Receipt, bg: 'bg-indigo-100', color: 'text-indigo-600', label: 'Total', value: stats.total },
          { icon: CheckCheck, bg: 'bg-green-100', color: 'text-green-600', label: 'Success', value: stats.success },
          { icon: Clock, bg: 'bg-amber-100', color: 'text-amber-600', label: 'Pending', value: stats.pending },
          { icon: AlertCircle, bg: 'bg-red-100', color: 'text-red-600', label: 'Failed', value: stats.failed },
          { icon: DollarSign, bg: 'bg-emerald-100', color: 'text-emerald-600', label: 'Revenue', value: formatRupiahShort(stats.totalRevenue) },
        ].map((card, i) => {
          const Icon = card.icon
          return (
            <div key={i} className="bg-white rounded-xl border border-border p-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg ${card.bg} flex items-center justify-center`}><Icon className={`w-5 h-5 ${card.color}`} /></div>
                <div><p className="text-2xl font-bold text-gray-900">{card.value}</p><p className="text-xs text-gray-500">{card.label}</p></div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari invoice, customer, course..." className="w-full h-9 pl-10 pr-3 rounded-lg border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
        {(['all', 'success', 'pending', 'failed'] as const).map((s) => (
          <button key={s} onClick={() => { setStatusFilter(s); setPage(1) }} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none ${statusFilter === s ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600 border border-border hover:bg-gray-50'}`}>
            {statusLabels[s]}
          </button>
        ))}
        <button onClick={resetFilters} className="px-3 py-1.5 rounded-lg border border-border bg-white text-sm text-gray-600 hover:bg-gray-50 transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none">Reset</button>
      </div>

      {selectedIds.size > 0 && (
        <div className="flex items-center gap-3 mb-4 px-4 py-3 bg-indigo-50 rounded-xl border border-indigo-200">
          <span className="text-sm font-medium text-indigo-700">{selectedIds.size} transaksi dipilih</span>
          <div className="flex gap-2 ml-auto">
            <button onClick={() => handleBulkAction('success')} disabled={actionLoading === 'bulk'} className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs font-medium hover:bg-green-700 disabled:opacity-50 transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none">
              {actionLoading === 'bulk' ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />} Success
            </button>
            <button onClick={() => handleBulkAction('pending')} disabled={actionLoading === 'bulk'} className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 text-white rounded-lg text-xs font-medium hover:bg-amber-700 disabled:opacity-50 transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none">
              {actionLoading === 'bulk' ? <Loader2 className="w-3 h-3 animate-spin" /> : <Clock className="w-3 h-3" />} Pending
            </button>
            <button onClick={() => handleBulkAction('failed')} disabled={actionLoading === 'bulk'} className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 text-white rounded-lg text-xs font-medium hover:bg-red-700 disabled:opacity-50 transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none">
              {actionLoading === 'bulk' ? <Loader2 className="w-3 h-3 animate-spin" /> : <X className="w-3 h-3" />} Failed
            </button>
            <button onClick={() => handleBulkAction('delete')} disabled={actionLoading === 'bulk'} className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 text-white rounded-lg text-xs font-medium hover:bg-red-700 disabled:opacity-50 transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none">
              {actionLoading === 'bulk' ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />} Hapus
            </button>
          </div>
        </div>
      )}

      {visibleTransactions.length === 0 ? (
        <EmptyState title="Tidak ada transaksi" description="Belum ada transaksi yang sesuai dengan filter." action={search !== '' || statusFilter !== 'all' ? { label: 'Reset Filter', onClick: resetFilters } : undefined} />
      ) : (
        <>
          <div className="bg-white rounded-xl border border-border overflow-x-auto">
            <div className="hidden lg:grid grid-cols-[32px_1fr_1.2fr_1.5fr_100px_100px_80px_120px_100px] gap-3 p-4 bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider items-center">
              <div><input type="checkbox" checked={visibleTransactions.length > 0 && selectedIds.size === visibleTransactions.length} onChange={(e) => selectAll(e.target.checked)} className="accent-indigo-600 outline-none" /></div>
              <span>Invoice</span><span>Customer</span><span>Course</span><span className="text-center">Jumlah</span><span className="text-center">Status</span><span>Bayar</span><span>Tanggal</span><span className="text-center">Aksi</span>
            </div>
            <div className="divide-y divide-black/10">
              {visibleTransactions.map((txn) => {
                const isSelected = selectedIds.has(txn.id)
                const isDeleting = actionLoading === txn.id
                return (
                  <div key={txn.id} className={`${isSelected ? 'bg-indigo-50/50' : ''}`}>
                    <div className="block lg:hidden bg-white rounded-xl border border-border p-3 mx-3 my-2 shadow-sm">
                      <div className="flex items-start gap-3">
                        <input type="checkbox" checked={isSelected} onChange={() => toggleSelect(txn.id)} className="accent-indigo-600 outline-none mt-1" />
                        <div className="min-w-0 flex-1">
                          <p className="font-mono text-xs text-gray-500">{txn.invoice}</p>
                          <p className="text-gray-900 font-medium truncate">{txn.customerName}</p>
                          <p className="text-gray-500 truncate text-xs">{txn.courseTitle}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-2 ml-7">
                        <span className="font-medium text-gray-900">{formatRupiah(txn.amount)}</span>
                        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(txn.status)}`}>{txn.status}</span>
                        <span className="text-xs text-gray-400 ml-auto">{getRelativeTime(txn.createdAt)}</span>
                      </div>
                      <div className="flex items-center justify-end gap-1 mt-2 border-t border-border pt-2">
                        <button onClick={() => openEditModal(txn)} className="p-1.5 text-gray-400 hover:text-indigo-600 outline-none rounded" aria-label="Edit Status"><Edit3 className="w-4 h-4" /></button>
                        <button onClick={() => setDeleteTarget(txn)} disabled={isDeleting} className="p-1.5 text-gray-400 hover:text-red-500 outline-none rounded disabled:opacity-50" aria-label="Hapus">
                          {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <div className={`hidden lg:grid grid-cols-[32px_1fr_1.2fr_1.5fr_100px_100px_80px_120px_100px] gap-3 p-4 items-center text-sm`}>
                      <input type="checkbox" checked={isSelected} onChange={() => toggleSelect(txn.id)} className="accent-indigo-600 outline-none" />
                      <span className="font-mono text-xs text-gray-500 truncate">{txn.invoice}</span>
                      <span className="text-gray-900 font-medium truncate">{txn.customerName}</span>
                      <span className="text-gray-500 truncate">{txn.courseTitle}</span>
                      <span className="font-medium text-gray-900 text-center">{formatRupiah(txn.amount)}</span>
                      <span className={`inline-block w-max mx-auto px-2 py-0.5 rounded-full text-xs font-medium text-center ${getStatusColor(txn.status)}`}>{txn.status}</span>
                      <span className="text-gray-500 text-xs capitalize">{txn.paymentMethod.replace('_', ' ')}</span>
                      <span className="text-gray-500 text-xs">{getRelativeTime(txn.createdAt)}</span>
                      <div className="flex items-center justify-center gap-1">
                        <button onClick={() => openEditModal(txn)} className="p-1.5 text-gray-400 hover:text-indigo-600 outline-none rounded" aria-label="Edit Status"><Edit3 className="w-4 h-4" /></button>
                        <button onClick={() => setDeleteTarget(txn)} disabled={isDeleting} className="p-1.5 text-gray-400 hover:text-red-500 outline-none rounded disabled:opacity-50" aria-label="Hapus">
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
            <span>Menampilkan {Math.min((page - 1) * perPage + 1, filtered.length)}-{Math.min(page * perPage, filtered.length)} dari {filtered.length} transaksi</span>
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

      {editTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setEditTarget(null)}>
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center"><Edit3 className="w-5 h-5 text-indigo-600" /></div>
              <h2 className="text-lg font-semibold text-gray-900">Ubah Status Transaksi</h2>
            </div>
            <p className="text-sm text-gray-600 mb-1">Invoice: <span className="font-mono font-medium">{editTarget.invoice}</span></p>
            <p className="text-sm text-gray-600 mb-4">Customer: <span className="font-medium">{editTarget.customerName}</span></p>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <div className="flex gap-2">
                {(['success', 'pending', 'failed'] as TransactionStatus[]).map((s) => (
                  <button key={s} onClick={() => setEditStatus(s)} className={`flex-1 h-10 rounded-lg text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none ${
                    editStatus === s
                      ? s === 'success' ? 'bg-green-600 text-white'
                        : s === 'pending' ? 'bg-amber-600 text-white'
                        : 'bg-red-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}>{s}</button>
                ))}
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => setEditTarget(null)} className="px-4 py-2 border border-border rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none">Batal</button>
              <button type="button" onClick={handleEdit} disabled={saving} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-60 flex items-center gap-2 transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none">
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                {saving ? 'Menyimpan...' : 'Simpan'}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setDeleteTarget(null)}>
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center"><Trash2 className="w-5 h-5 text-red-600" /></div>
              <h2 className="text-lg font-semibold text-gray-900">Hapus Transaksi</h2>
            </div>
            <p className="text-sm text-gray-600 mb-1">Apakah Anda yakin ingin menghapus transaksi berikut?</p>
            <p className="text-sm font-medium text-gray-900 mb-6 bg-gray-50 rounded-lg p-3">&ldquo;{deleteTarget.invoice}&rdquo; - {deleteTarget.customerName}</p>
            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => setDeleteTarget(null)} className="px-4 py-2 border border-border rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none">Batal</button>
              <button type="button" onClick={() => handleDelete(deleteTarget.id)} disabled={actionLoading === deleteTarget.id} className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-60 flex items-center gap-2 transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none">
                {actionLoading === deleteTarget.id && <Loader2 className="w-4 h-4 animate-spin" />}
                {actionLoading === deleteTarget.id ? 'Menghapus...' : 'Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}