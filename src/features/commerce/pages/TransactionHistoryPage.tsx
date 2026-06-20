import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useAsync } from '@/shared/hooks/useAsync'
import { repos } from '@/core/domain/di'
import { formatRupiah, getRelativeTime, getStatusColor } from '@/shared/utils'
import type { Transaction, TransactionStatus } from '@/shared/types'
import ErrorState from '@/shared/components/common/ErrorState'
import EmptyState from '@/shared/components/common/EmptyState'
import LoadingSpinner from '@/shared/components/common/LoadingSpinner'

const ITEMS_PER_PAGE = 5

export default function TransactionHistoryPage() {
  const navigate = useNavigate()
  const { data: transactions, isLoading, error, refetch } = useAsync<Transaction[]>(
    () => repos.transaction.findByUserId('1')
  )

  const [statusFilter, setStatusFilter] = useState<TransactionStatus | 'all'>('all')
  const [currentPage, setCurrentPage] = useState(1)

  if (isLoading) return <LoadingSpinner fullPage />
  if (error) return <ErrorState message={error} onRetry={refetch} />
  if (!transactions || transactions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <EmptyState
          title="Belum Ada Transaksi"
          description="Anda belum melakukan pembelian course apapun."
          action={{ label: 'Cari Course', onClick: () => navigate('/courses') }}
        />
      </div>
    )
  }

  const filtered = statusFilter === 'all'
    ? transactions
    : transactions.filter(t => t.status === statusFilter)

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE))
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Riwayat Transaksi</h1>

        <div className="flex flex-wrap items-center gap-2 mb-6">
          {['all', 'success', 'pending', 'failed'].map((s) => (
            <button
              key={s}
              onClick={() => { setStatusFilter(s as TransactionStatus | 'all'); setCurrentPage(1) }}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none ${
                  statusFilter === s
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-gray-600 border border-black/10 hover:bg-gray-50'
                }`}
            >
              {s === 'all' ? 'Semua' : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-xl border border-black/10 overflow-hidden">
          <div className="hidden md:grid grid-cols-[1fr_1.5fr_1fr_1fr_1fr] gap-4 p-4 bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            <span>Invoice</span>
            <span>Course</span>
            <span>Tanggal</span>
            <span>Jumlah</span>
            <span>Status</span>
          </div>
          <div className="divide-y divide-black/10">
            {paginated.map((tx) => (
              <div key={tx.id} className="grid grid-cols-1 md:grid-cols-[1fr_1.5fr_1fr_1fr_1fr] gap-2 p-4 items-center text-sm">
                <span className="font-mono text-xs text-gray-500">{tx.invoice}</span>
                <span className="text-gray-900 font-medium truncate">{tx.courseTitle}</span>
                <span className="text-gray-500">{getRelativeTime(tx.createdAt)}</span>
                <span className="font-semibold text-gray-900">{formatRupiah(tx.amount)}</span>
                <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(tx.status)}`}>
                  {tx.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-6">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none ${
                  currentPage === i + 1
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-gray-600 border border-black/10 hover:bg-gray-50'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
