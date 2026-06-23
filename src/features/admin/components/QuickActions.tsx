import { useNavigate } from 'react-router'
import { FileText, BookOpen, Users, CreditCard, BarChart3, PlusCircle } from 'lucide-react'

const actions = [
  { icon: FileText, label: 'Tulis Artikel', description: 'Buat konten baru', path: '/admin/articles' },
  { icon: BookOpen, label: 'Tambah Course', description: 'Publikasikan kursus', path: '/admin/courses' },
  { icon: Users, label: 'Kelola User', description: 'Atur pengguna', path: '/admin/users' },
  { icon: CreditCard, label: 'Transaksi', description: 'Lihat pembayaran', path: '/admin/transactions' },
  { icon: BarChart3, label: 'Laporan', description: 'Analitik & statistik', path: '/admin' },
  { icon: PlusCircle, label: 'Promo Baru', description: 'Buat kupon diskon', path: '/admin' },
]

export default function QuickActions() {
  const navigate = useNavigate()

  return (
    <div className="bg-white rounded-xl border border-black/10 p-5">
      <h2 className="text-sm font-semibold text-gray-900 mb-4">Quick Actions</h2>
      <div className="grid grid-cols-3 gap-3">
        {actions.map((a) => (
          <button
            key={a.label}
            onClick={() => navigate(a.path)}
            className="flex flex-col items-center gap-1.5 p-3 rounded-xl border border-black/5 bg-gray-50/50 hover:bg-indigo-50 hover:border-indigo-200 transition-all focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none group"
          >
            <a.icon className="w-5 h-5 text-gray-400 group-hover:text-indigo-600 transition-colors" />
            <span className="text-xs font-medium text-gray-600 group-hover:text-indigo-700 transition-colors">{a.label}</span>
            <span className="text-[10px] text-gray-400 group-hover:text-indigo-500 transition-colors hidden sm:block">{a.description}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
