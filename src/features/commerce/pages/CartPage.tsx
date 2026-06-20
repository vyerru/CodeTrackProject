import { useNavigate } from 'react-router'
import { Trash2 } from 'lucide-react'
import { useCartStore } from '../store/cartStore'
import { formatRupiah } from '@/shared/utils'
import EmptyState from '@/shared/components/common/EmptyState'

export default function CartPage() {
  const navigate = useNavigate()
  const { items, total, remove, clear } = useCartStore()

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <EmptyState
          title="Keranjang Kosong"
          description="Belum ada course yang ditambahkan ke keranjang."
          action={{ label: 'Cari Course', onClick: () => navigate('/courses') }}
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Keranjang</h1>
          <button
            onClick={clear}
            className="text-sm text-red-500 hover:text-red-600 transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none"
          >
            Kosongkan Keranjang
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 bg-white rounded-xl border border-black/10 p-4"
              >
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">{item.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">Qty: {item.quantity}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="font-semibold text-indigo-600">{formatRupiah(item.price)}</div>
                </div>
                <button
                  onClick={() => remove(item.id)}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors flex-shrink-0 focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="lg:sticky lg:top-24 self-start">
            <div className="bg-white rounded-xl border border-black/10 p-6 shadow-sm space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Ringkasan</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({items.length} item)</span>
                  <span className="text-gray-900 font-medium">{formatRupiah(total)}</span>
                </div>
                <div className="border-t border-black/10 pt-3 flex justify-between font-semibold text-gray-900">
                  <span>Total</span>
                  <span className="text-indigo-600">{formatRupiah(total)}</span>
                </div>
              </div>
              <button
                onClick={() => navigate('/dashboard/checkout')}
                className="w-full h-11 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none"
              >
                Lanjut ke Checkout
              </button>
              <button
                onClick={() => navigate('/courses')}
                className="w-full h-11 border-2 border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:border-gray-400 hover:bg-gray-50 transition-all focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none"
              >
                Tambah Course Lain
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
