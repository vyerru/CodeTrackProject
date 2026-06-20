import { useNavigate } from 'react-router'

export default function CTASection() {
  const navigate = useNavigate()

  return (
    <section className="bg-gradient-to-r from-indigo-600 to-purple-600 py-20">
      <div className="max-w-2xl mx-auto px-6 text-center space-y-6">
        <h2 className="text-3xl font-bold text-white leading-tight">
          Siap Mulai Journey Coding Kamu?
        </h2>
        <p className="text-indigo-100 leading-relaxed">
          Dapatkan akses gratis 7 hari ke semua course premium
        </p>
        <button
          onClick={() => navigate('/auth/register')}
          className="bg-white text-indigo-600 hover:bg-gray-100 font-semibold rounded-lg px-8 py-3 transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none"
        >
          Daftar Sekarang
        </button>
        <p className="text-indigo-200 text-sm">✓ Tidak perlu kartu kredit</p>
      </div>
    </section>
  )
}
