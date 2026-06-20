import { useNavigate } from 'react-router'
import { Home, ArrowLeft } from 'lucide-react'

export default function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 text-center">
      <div className="text-8xl font-bold text-indigo-600 mb-4">404</div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Halaman Tidak Ditemukan</h1>
      <p className="text-sm text-gray-500 max-w-md mb-8">
        Halaman yang Anda cari mungkin telah dipindahkan, dihapus, atau tidak pernah ada.
      </p>
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-5 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:border-gray-400 hover:bg-gray-50 transition-all focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali
        </button>
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-all focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none"
        >
          <Home className="w-4 h-4" />
          Ke Beranda
        </button>
      </div>
    </div>
  )
}
