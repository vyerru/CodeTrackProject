import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { X, Loader2 } from 'lucide-react'
import type { User } from '@/shared/types'

const userSchema = z
  .object({
    name: z.string().min(2, 'Nama minimal 2 karakter'),
    email: z.string().email('Email tidak valid'),
    role: z.enum(['student', 'instructor', 'admin']),
    status: z.enum(['Active', 'Inactive']),
    password: z.string().min(6, 'Password minimal 6 karakter').optional().or(z.literal('')),
    confirmPassword: z.string().optional().or(z.literal('')),
    avatar: z.string().url('URL tidak valid').or(z.literal('')).optional(),
  })
  .refine(
    (data) => {
      if (!data.password && !data.confirmPassword) return true
      return data.password === data.confirmPassword
    },
    { message: 'Password tidak cocok', path: ['confirmPassword'] }
  )

export type UserFormData = z.infer<typeof userSchema>

interface Props {
  editingUser: User | null
  saving: boolean
  onSave: (data: UserFormData) => Promise<void>
  onClose: () => void
}

export default function UserFormModal({ editingUser, saving, onSave, onClose }: Props) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: editingUser?.name ?? '',
      email: editingUser?.email ?? '',
      role: editingUser?.role ?? 'student',
      status: (editingUser?.status as 'Active' | 'Inactive') ?? 'Active',
      password: '',
      confirmPassword: '',
      avatar: editingUser?.avatar ?? '',
    },
  })

  const isEditing = !!editingUser

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-8 overflow-y-auto bg-black/50" onClick={onClose}>
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-lg font-semibold text-gray-900">{isEditing ? 'Edit Pengguna' : 'Tambah Pengguna'}</h2>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none rounded"><X className="w-5 h-5" /></button>
        </div>

        <form onSubmit={handleSubmit(onSave)} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
            <input {...register('name')} placeholder="Masukkan nama lengkap" className="w-full h-9 px-3 rounded-lg border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input {...register('email')} type="email" placeholder="nama@email.com" className="w-full h-9 px-3 rounded-lg border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <select {...register('role')} className="w-full h-9 px-3 rounded-lg border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option value="student">Student</option>
                <option value="instructor">Instructor</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <div className="flex gap-2 h-9 items-center">
                <button type="button" onClick={() => setValue('status', 'Active')} className={`flex-1 h-full rounded-lg text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none ${watch('status') === 'Active' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>Active</button>
                <button type="button" onClick={() => setValue('status', 'Inactive')} className={`flex-1 h-full rounded-lg text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none ${watch('status') === 'Inactive' ? 'bg-gray-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>Inactive</button>
              </div>
            </div>
          </div>

          {!isEditing && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input {...register('password')} type="password" placeholder="Minimal 6 karakter" className="w-full h-9 px-3 rounded-lg border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Konfirmasi Password</label>
                <input {...register('confirmPassword')} type="password" placeholder="Ulangi password" className="w-full h-9 px-3 rounded-lg border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword.message}</p>}
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Avatar URL (opsional)</label>
            <input {...register('avatar')} placeholder="https://example.com/avatar.jpg" className="w-full h-9 px-3 rounded-lg border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            {errors.avatar && <p className="text-xs text-red-500 mt-1">{errors.avatar.message}</p>}
          </div>

          <div className="flex justify-end gap-3 pt-2 border-t border-border">
            <button type="button" onClick={onClose} className="px-4 py-2 border border-border rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none">Batal</button>
            <button type="submit" disabled={saving} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-60 flex items-center gap-2 transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none">
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              {saving ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}