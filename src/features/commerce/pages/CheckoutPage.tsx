import { useState, useRef } from 'react'
import { useNavigate } from 'react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CreditCard, Banknote, Wallet, User, Mail, Phone, MapPin, Copy, Check,
  Loader2, CheckCircle, ArrowRight,
} from 'lucide-react'
import { useCartStore } from '../store/cartStore'
import { useAuthStore } from '@/features/auth/store/authStore'
import { repos } from '@/core/domain/di'
import { formatRupiah } from '@/shared/utils'
import EmptyState from '@/shared/components/common/EmptyState'
import type { Transaction } from '@/shared/types'

const checkoutSchema = z.object({
  name: z.string().min(2, 'Nama minimal 2 karakter'),
  email: z.string().email('Email tidak valid'),
  phone: z.string().min(10, 'Nomor HP minimal 10 digit').regex(/^\d+$/, 'Hanya angka yang diperbolehkan'),
  address: z.string().min(5, 'Alamat minimal 5 karakter'),
})

type CheckoutFormData = z.infer<typeof checkoutSchema>

const paymentMethods = [
  { id: 'transfer', label: 'Transfer Bank', icon: Banknote },
  { id: 'credit_card', label: 'Kartu Kredit', icon: CreditCard },
  { id: 'ewallet', label: 'E-Wallet', icon: Wallet },
]

const bankAccounts = [
  { name: 'BCA', number: '1234567890', holder: 'PT CodeTrack Edukasi' },
  { name: 'Mandiri', number: '9876543210', holder: 'PT CodeTrack Edukasi' },
  { name: 'BNI', number: '5556667770', holder: 'PT CodeTrack Edukasi' },
]

export default function CheckoutPage() {
  const navigate = useNavigate()
  const { items, total, clear } = useCartStore()
  const { user } = useAuthStore()
  const [method, setMethod] = useState('transfer')
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)
  const [transactionResult, setTransactionResult] = useState<Transaction | null>(null)
  const [copiedBank, setCopiedBank] = useState<string | null>(null)
  const copyTimeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined)

  const copyToClipboard = (number: string, bankName: string) => {
    navigator.clipboard.writeText(number)
    setCopiedBank(bankName)
    clearTimeout(copyTimeoutRef.current)
    copyTimeoutRef.current = setTimeout(() => setCopiedBank(null), 2000)
  }

  const [cardNumber, setCardNumber] = useState('')
  const [cardExpiry, setCardExpiry] = useState('')
  const [cardCvv, setCardCvv] = useState('')
  const [cardName, setCardName] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      name: user?.name ?? '',
      email: user?.email ?? '',
      phone: '',
      address: '',
    },
  })

  if (items.length === 0 && !isSuccess) {
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

  const paymentLabel = paymentMethods.find((pm) => pm.id === method)?.label ?? method

  if (isSuccess && transactionResult) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-lg bg-white rounded-2xl border border-black/10 shadow-sm p-8 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.15, type: 'spring', stiffness: 200, damping: 15 }}
          >
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          </motion.div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Pembayaran Berhasil!</h2>
          <p className="text-sm text-gray-500 mb-6">
            Terima kasih, {transactionResult.customerName}. Pesanan Anda sedang diproses.
          </p>

          <div className="bg-gray-50 rounded-xl p-4 space-y-3 text-left mb-6">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Invoice</span>
              <span className="text-gray-900 font-medium font-mono text-xs">{transactionResult.invoice}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Metode</span>
              <span className="text-gray-900 font-medium">{paymentLabel}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Total</span>
              <span className="text-indigo-600 font-bold">{formatRupiah(transactionResult.amount)}</span>
            </div>
          </div>

          <p className="text-xs text-gray-400 mb-6">
            Konfirmasi pembayaran dan detail course akan dikirim ke email Anda.
          </p>

          <div className="space-y-3">
            <button
              onClick={() => navigate('/dashboard/history')}
              className="w-full h-11 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none"
            >
              Lihat Riwayat
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate('/courses')}
              className="w-full h-11 border-2 border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:border-gray-400 hover:bg-gray-50 transition-all focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none"
            >
              Jelajahi Course Lain
            </button>
          </div>
        </motion.div>
      </div>
    )
  }

  const onPay = handleSubmit(async (data) => {
    setIsProcessing(true)
    setError(null)

    try {
      const result = await repos.transaction.create({
        userId: user?.id ?? '1',
        customerName: data.name,
        customerEmail: data.email,
        customerPhone: data.phone,
        customerAddress: data.address,
        items: items.map((item) => ({
          id: item.id,
          title: item.title,
          price: item.price,
          quantity: item.quantity,
        })),
        amount: total,
        paymentMethod: method,
      })
      setTransactionResult(result)
      setIsSuccess(true)
      clear()
    } catch {
      setError('Pembayaran gagal. Silakan coba lagi.')
    } finally {
      setIsProcessing(false)
    }
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
          <div className="space-y-6">
            {/* Detail Pembeli */}
            <motion.form
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              onSubmit={onPay}
              className="bg-white rounded-xl border border-black/10 p-6 space-y-4"
            >
              <h2 className="text-lg font-semibold text-gray-900">Detail Pembeli</h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Nama Lengkap</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    {...register('name')}
                    disabled={isProcessing}
                    aria-label="Nama Lengkap"
                    className="w-full h-10 pl-10 pr-3 text-sm bg-white rounded-lg border border-black/10 text-gray-900 placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="Masukkan nama lengkap"
                  />
                </div>
                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    {...register('email')}
                    disabled={isProcessing}
                    aria-label="Email"
                    className="w-full h-10 pl-10 pr-3 text-sm bg-white rounded-lg border border-black/10 text-gray-900 placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="nama@email.com"
                  />
                </div>
                {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Nomor HP</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    {...register('phone')}
                    disabled={isProcessing}
                    aria-label="Nomor HP"
                    className="w-full h-10 pl-10 pr-3 text-sm bg-white rounded-lg border border-black/10 text-gray-900 placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="08xxxxxxxxxx"
                  />
                </div>
                {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Alamat</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 text-gray-400" size={16} />
                  <textarea
                    {...register('address')}
                    disabled={isProcessing}
                    aria-label="Alamat"
                    rows={3}
                    className="w-full pl-10 pr-3 py-2.5 text-sm bg-white rounded-lg border border-black/10 text-gray-900 placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none resize-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="Masukkan alamat lengkap"
                  />
                </div>
                {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address.message}</p>}
              </div>

              <button type="submit" className="hidden" />
            </motion.form>

            {/* Metode Pembayaran */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="bg-white rounded-xl border border-black/10 p-6"
            >
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
                      } ${isProcessing ? 'pointer-events-none opacity-60' : ''}`}
                      aria-label={pm.label}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={pm.id}
                        checked={method === pm.id}
                        onChange={(e) => setMethod(e.target.value)}
                        disabled={isProcessing}
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

              <AnimatePresence mode="wait">
                {method === 'transfer' && (
                  <motion.div
                    key="transfer"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-4 pt-4 border-t border-black/10 space-y-3">
                      <p className="text-sm text-gray-500">Transfer ke salah satu rekening berikut:</p>
                      {bankAccounts.map((bank) => (
                        <div
                          key={bank.name}
                          className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-black/5"
                        >
                          <div>
                            <p className="text-sm font-semibold text-gray-900">{bank.name}</p>
                            <p className="text-xs text-gray-500">{bank.holder}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-mono font-semibold text-gray-900 tracking-wider">
                              {bank.number}
                            </span>
                            <button
                              type="button"
                              onClick={() => copyToClipboard(bank.number, bank.name)}
                              className="p-1.5 rounded-md hover:bg-gray-200 transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none"
                              title="Salin nomor rekening"
                            >
                              {copiedBank === bank.name ? (
                                <Check className="w-4 h-4 text-green-600" />
                              ) : (
                                <Copy className="w-4 h-4 text-gray-400" />
                              )}
                            </button>
                          </div>
                        </div>
                      ))}
                      <p className="text-xs text-gray-400 italic">
                        Konfirmasi pembayaran akan diproses otomatis setelah transfer terverifikasi.
                      </p>
                    </div>
                  </motion.div>
                )}

                {method === 'credit_card' && (
                  <motion.div
                    key="credit_card"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-4 pt-4 border-t border-black/10 space-y-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Nomor Kartu</label>
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').slice(0, 16))}
                          disabled={isProcessing}
                          aria-label="Nomor Kartu Kredit"
                          placeholder="1234 5678 9012 3456"
                          className="w-full h-9 px-3 text-sm bg-white rounded-lg border border-black/10 text-gray-900 placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Masa Berlaku</label>
                          <input
                            type="text"
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value.replace(/\D/g, '').slice(0, 4))}
                            disabled={isProcessing}
                            aria-label="Masa berlaku kartu"
                            placeholder="MM/YY"
                            className="w-full h-9 px-3 text-sm bg-white rounded-lg border border-black/10 text-gray-900 placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">CVV</label>
                          <input
                            type="text"
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                            disabled={isProcessing}
                            aria-label="CVV"
                            placeholder="123"
                            className="w-full h-9 px-3 text-sm bg-white rounded-lg border border-black/10 text-gray-900 placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Nama Pemegang Kartu</label>
                        <input
                          type="text"
                          value={cardName}
                          onChange={(e) => setCardName(e.target.value)}
                          disabled={isProcessing}
                          aria-label="Nama pemegang kartu"
                          placeholder="JOHN DOE"
                          className="w-full h-9 px-3 text-sm bg-white rounded-lg border border-black/10 text-gray-900 placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none uppercase"
                        />
                      </div>
                      <p className="text-xs text-gray-400 italic">
                        Data kartu bersifat dummy — tidak ada transaksi riil yang diproses.
                      </p>
                    </div>
                  </motion.div>
                )}

                {method === 'ewallet' && (
                  <motion.div
                    key="ewallet"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-4 pt-4 border-t border-black/10">
                      <div className="flex flex-col items-center py-4">
                        <Wallet className="w-16 h-16 text-indigo-600 mb-3" />
                        <p className="text-sm font-medium text-gray-900">Pilih E-Wallet</p>
                        <div className="grid grid-cols-3 gap-3 mt-4 w-full max-w-xs">
                          {['GoPay', 'OVO', 'DANA'].map((ew) => (
                            <button
                              key={ew}
                              type="button"
                              className="py-2 px-3 text-xs font-medium rounded-lg border border-black/10 text-gray-700 hover:border-indigo-600 hover:text-indigo-600 transition-all focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none"
                            >
                              {ew}
                            </button>
                          ))}
                        </div>
                        <p className="text-xs text-gray-400 italic mt-4">
                          Anda akan diarahkan ke aplikasi pembayaran setelah checkout.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="lg:sticky lg:top-24 self-start space-y-4"
          >
            <div className="bg-white rounded-xl border border-black/10 p-6 shadow-sm space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Ringkasan Pesanan</h2>
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.id} className="text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 truncate">{item.title}</span>
                      <span className="text-gray-900 font-medium flex-shrink-0 ml-2">
                        {formatRupiah(item.price * (item.quantity || 1))}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {item.quantity || 1} × {formatRupiah(item.price)}
                    </p>
                  </div>
                ))}
              </div>
              <div className="border-t border-black/10 pt-3 space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="text-gray-900">{formatRupiah(total)}</span>
                </div>
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
              onClick={onPay}
              disabled={isProcessing}
              className="w-full h-12 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Memproses...
                </>
              ) : (
                `Bayar ${formatRupiah(total)}`
              )}
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
