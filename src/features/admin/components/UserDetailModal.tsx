import { X, Clock, Award, Flame, BookOpen, Activity } from 'lucide-react'
import { getRelativeTime } from '@/shared/utils'
import type { UserDetail } from '@/shared/types'
import { getInitials, getRoleBadgeClass, getStatusBadgeClass } from './admin-helpers'

interface Props {
  user: UserDetail
  onClose: () => void
}

export default function UserDetailModal({ user, onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-8 overflow-y-auto bg-black/50" onClick={onClose}>
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-lg font-semibold text-gray-900">Detail Pengguna</h2>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none rounded"><X className="w-5 h-5" /></button>
        </div>

        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          <div className="flex items-center gap-4">
            {user.avatar ? (
              <img src={user.avatar} alt="" className="w-16 h-16 rounded-full object-cover" />
            ) : (
              <div className="w-16 h-16 rounded-full bg-indigo-100 text-indigo-600 text-xl font-semibold flex items-center justify-center">{getInitials(user.name)}</div>
            )}
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
              <p className="text-sm text-gray-500">{user.email}</p>
              <div className="flex gap-2 mt-1.5">
                <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${getRoleBadgeClass(user.role)}`}>{user.role}</span>
                <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(user.status ?? 'Active')}`}>{user.status ?? 'Active'}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-gray-500">Tanggal Daftar</p>
              <p className="font-medium text-gray-900">{new Date(user.createdAt).toLocaleDateString('id-ID')}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-gray-500">Terakhir Aktif</p>
              <p className="font-medium text-gray-900">{user.lastActive ? getRelativeTime(user.lastActive) : '-'}</p>
            </div>
          </div>

          {user.role === 'student' && (
            <>
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-blue-50 rounded-lg p-3 text-center">
                  <Clock className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                  <p className="text-lg font-bold text-blue-700">{user.totalLearningTime ?? 0}h</p>
                  <p className="text-xs text-blue-600">Total Belajar</p>
                </div>
                <div className="bg-green-50 rounded-lg p-3 text-center">
                  <Award className="w-5 h-5 text-green-600 mx-auto mb-1" />
                  <p className="text-lg font-bold text-green-700">{user.certificatesEarned ?? 0}</p>
                  <p className="text-xs text-green-600">Sertifikat</p>
                </div>
                <div className="bg-amber-50 rounded-lg p-3 text-center">
                  <Flame className="w-5 h-5 text-amber-600 mx-auto mb-1" />
                  <p className="text-lg font-bold text-amber-700">{user.currentStreak ?? 0} hr</p>
                  <p className="text-xs text-amber-600">Streak</p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2"><BookOpen className="w-4 h-4" /> Course yang Di-enroll</h4>
                <div className="space-y-2">
                  {user.enrolledCourses?.map((course, i) => (
                    <div key={i} className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-900 truncate">{course.title}</span>
                        <span className="text-xs text-gray-500 ml-2">{course.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div className="bg-indigo-600 h-1.5 rounded-full transition-all" style={{ width: `${course.progress}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2"><Activity className="w-4 h-4" /> Aktivitas Terbaru</h4>
                <div className="space-y-1">
                  {user.recentActivities?.map((act, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm py-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-gray-700 truncate">{act.title}</p>
                        <p className="text-xs text-gray-400">{act.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        <div className="px-6 py-4 border-t border-border flex justify-end">
          <button onClick={onClose} className="px-4 py-2 border border-border rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none">Tutup</button>
        </div>
      </div>
    </div>
  )
}