import { useState, useMemo } from 'react'
import { Search, Download } from 'lucide-react'
import { useAsync } from '@/shared/hooks/useAsync'
import { repos } from '@/core/domain/di'
import { formatRupiah, getStatusColor, getRelativeTime } from '@/shared/utils'
import type { Transaction, TransactionStatus } from '@/shared/types'
import ErrorState from '@/shared/components/common/ErrorState'
import LoadingSpinner from '@/shared/components/common/LoadingSpinner'

export default function TransactionManagementPage() {
  const { data: transactions, isLoading, error, refetch } = useAsync<Transaction[]>(
    () => repos.transaction.findAll()
  )
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<TransactionStatus | 'all'>('all')

  const filtered = useMemo(() => {
    if (!transactions) return []
    let result = transactions
    if (statusFilter !== 'all') {
      result = result.filter(t => t.status === statusFilter)
    }
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(t =>
        t.invoice.toLowerCase().includes(q) ||
        t.customerName.toLowerCase().includes(q) ||
        t.courseTitle.toLowerCase().includes(q)
      )
    }
    return result
  }, [transactions, search, statusFilter])

  if (isLoading) return <LoadingSpinner />
  if (error) return <ErrorState message={error} onRetry={refetch} />

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-xl font-bold text-gray-900">Kelola Transaksi</h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-black/10 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none">
          <Download className="w-4 h-4" />
          Export
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari invoice, customer, course..."
            className="w-full h-9 pl-10 pr-3 rounded-lg border border-black/10 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div className="flex gap-2">
          {['all', 'success', 'pending', 'failed'].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s as TransactionStatus | 'all')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none ${
                  statusFilter === s
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-gray-600 border border-black/10 hover:bg-gray-50'
                }`}
            >
              {s === 'all' ? 'Semua' : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-black/10 overflow-hidden">
        <div className="hidden md:grid grid-cols-[1fr_1.5fr_1.5fr_1fr_1fr_1fr] gap-4 p-4 bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
          <span>Invoice</span><span>Customer</span><span>Course</span><span>Jumlah</span><span>Status</span><span>Tanggal</span>
        </div>
        <div className="divide-y divide-black/10">
          {filtered.map((t) => (
            <div key={t.id} className="grid grid-cols-1 md:grid-cols-[1fr_1.5fr_1.5fr_1fr_1fr_1fr] gap-2 p-4 items-center text-sm">
              <span className="font-mono text-xs text-gray-500">{t.invoice}</span>
              <span className="text-gray-900 font-medium truncate">{t.customerName}</span>
              <span className="text-gray-500 truncate">{t.courseTitle}</span>
              <span className="font-medium text-gray-900">{formatRupiah(t.amount)}</span>
              <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium text-center ${getStatusColor(t.status)}`}>
                {t.status}
              </span>
              <span className="text-gray-500">{getRelativeTime(t.createdAt)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
