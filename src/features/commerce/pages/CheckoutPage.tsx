import { useState } from 'react'
import { useNavigate } from 'react-router'
import { CreditCard, Banknote, Wallet } from 'lucide-react'
import { useCartStore } from '../store/cartStore'
import { useAuthStore } from '@/features/auth/store/authStore'
import { repos } from '@/core/domain/di'
import { formatRupiah } from '@/shared/utils'
import EmptyState from '@/shared/components/common/EmptyState'

const paymentMethods = [
  { id: 'transfer', label: 'Transfer Bank', icon: Banknote },
  { id: 'credit_card', label: 'Kartu Kredit', icon: CreditCard },
  { id: 'ewallet', label: 'E-Wallet', icon: Wallet },
]

export default function CheckoutPage() {
  const navigate = useNavigate()
  const { items, total, clear } = useCartStore()
  const { user } = useAuthStore()
  const [method, setMethod] = useState('transfer')
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <EmptyState
          title="Tidak Ada Item"
          description="Tambahkan course ke keranjang terlebih dahulu."
          action={{ label: 'Cari Course', onClick: () => navigate('/courses') }}
        />
      </div>
    )
  }

  const handlePay = async () => {
    setIsProcessing(true)
    setError(null)

    try {
      const firstItem = items[0]
      await repos.transaction.create({
        userId: user?.id ?? '1',
        customerName: user?.name ?? 'Guest',
        courseId: firstItem.id,
        courseTitle: firstItem.title,
        amount: total,
        paymentMethod: method,
      })
      clear()
      navigate('/dashboard/history')
    } catch {
      setError('Pembayaran gagal. Silakan coba lagi.')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
          <div className="space-y-6">
            {/* Detail Pembeli */}
            <div className="bg-white rounded-xl border border-black/10 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Detail Pembeli</h2>
              <div className="text-sm text-gray-600 space-y-2">
                <p><span className="text-gray-500">Nama:</span> <span className="text-gray-900 font-medium">{user?.name ?? 'Guest'}</span></p>
                <p><span className="text-gray-500">Email:</span> <span className="text-gray-900 font-medium">{user?.email ?? '-'}</span></p>
              </div>
            </div>

            {/* Metode Pembayaran */}
            <div className="bg-white rounded-xl border border-black/10 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Metode Pembayaran</h2>
              <div className="space-y-3">
                {paymentMethods.map((pm) => {
                  const Icon = pm.icon
                  return (
                    <label
                      key={pm.id}
                      className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none ${
                        method === pm.id
                          ? 'border-indigo-600 bg-indigo-50'
                          : 'border-black/10 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={pm.id}
                        checked={method === pm.id}
                        onChange={(e) => setMethod(e.target.value)}
                        className="sr-only"
                      />
                      <Icon className={`w-5 h-5 ${method === pm.id ? 'text-indigo-600' : 'text-gray-400'}`} />
                      <span className={`text-sm font-medium ${method === pm.id ? 'text-indigo-600' : 'text-gray-700'}`}>
                        {pm.label}
                      </span>
                    </label>
                  )
                })}
              </div>
            </div>
          </div>

          <div className="lg:sticky lg:top-24 self-start space-y-4">
            <div className="bg-white rounded-xl border border-black/10 p-6 shadow-sm space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Ringkasan Pesanan</h2>
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-600 truncate">{item.title}</span>
                    <span className="text-gray-900 font-medium flex-shrink-0 ml-2">{formatRupiah(item.price)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-black/10 pt-3 flex justify-between font-semibold text-lg">
                <span className="text-gray-900">Total</span>
                <span className="text-indigo-600">{formatRupiah(total)}</span>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <button
              onClick={handlePay}
              disabled={isProcessing}
              className="w-full h-12 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none"
            >
              {isProcessing ? 'Memproses...' : `Bayar ${formatRupiah(total)}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
