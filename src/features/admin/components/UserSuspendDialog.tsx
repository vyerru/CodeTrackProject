import { AlertTriangle, Loader2 } from 'lucide-react'
import type { User } from '@/shared/types'

interface Props {
  user: User
  loading: boolean
  onConfirm: () => void
  onCancel: () => void
}

export default function UserSuspendDialog({ user, loading, onConfirm, onCancel }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onCancel}>
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900">Suspend Pengguna</h2>
        </div>
        <p className="text-sm text-gray-600 mb-1">Apakah Anda yakin ingin menonaktifkan akun pengguna berikut?</p>
        <p className="text-sm font-medium text-gray-900 mb-6 bg-amber-50 rounded-lg p-3 border border-amber-200">
          &ldquo;{user.name}&rdquo; ({user.email})
        </p>
        <p className="text-xs text-amber-600 mb-4">Pengguna tidak akan bisa login sampai diaktifkan kembali.</p>
        <div className="flex justify-end gap-3">
          <button type="button" onClick={onCancel} disabled={loading} className="px-4 py-2 border border-border rounded-lg text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none">Batal</button>
          <button type="button" onClick={onConfirm} disabled={loading} className="px-4 py-2 bg-amber-600 text-white rounded-lg text-sm font-medium hover:bg-amber-700 disabled:opacity-60 flex items-center gap-2 transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none">
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading ? 'Memproses...' : 'Suspend'}
          </button>
        </div>
      </div>
    </div>
  )
}