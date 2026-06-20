import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { UserPlus, User, Mail, Users, Lock, Eye, EyeOff, Loader2 } from 'lucide-react'
import { useAuthStore } from '@/features/auth/store/authStore'
import { useRegister } from '@/features/auth/hooks/useRegister'

const registerSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email'),
    role: z.enum(['Student', 'Instructor']),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
    agreed: z.literal(true, {
      message: 'You must agree to the Terms of Service',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

type RegisterFormData = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const navigate = useNavigate()
  const storeLogin = useAuthStore((s) => s.login)
  const { register: registerUser, isLoading } = useRegister()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [roleOpen, setRoleOpen] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: 'Student', agreed: false as unknown as true },
  })

  const selectedRole = watch('role')

  const onSubmit = async (data: RegisterFormData) => {
    const user = await registerUser({
      name: data.name,
      email: data.email,
      role: data.role,
    })

    storeLogin({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: undefined,
    })
    navigate('/dashboard', { replace: true })
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'linear-gradient(117deg, #eef2ff 0%, #ffffff 50%, #faf5ff 100%)' }}
    >
      <div className="w-full max-w-md bg-white rounded-[14px] shadow-[0px_8px_10px_-6px_#0000001a,0px_20px_25px_-5px_#0000001a] p-8">
        <div className="flex justify-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-[#4f39f6] flex items-center justify-center shadow-[0px_10px_20px_-10px_rgba(79,57,246,0.7)]">
            <UserPlus className="text-white" size={26} />
          </div>
        </div>

        <h1 className="text-center text-xl font-bold text-[#111827] mb-1">Create your account</h1>
        <p className="text-center text-sm text-[#697282] mb-7">
          Start your learning journey with CodeTrack
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9ca3af]" size={16} />
              <input
                {...register('name')}
                placeholder="John Doe"
                className="w-full h-9 pl-10 pr-3 text-sm bg-[#f3f3f5] rounded-lg border border-transparent text-[#495565] placeholder:text-[#717182] focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none"
              />
            </div>
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9ca3af]" size={16} />
              <input
                {...register('email')}
                placeholder="name@example.com"
                className="w-full h-9 pl-10 pr-3 text-sm bg-[#f3f3f5] rounded-lg border border-transparent text-[#495565] placeholder:text-[#717182] focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none"
              />
            </div>
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9ca3af]" size={16} />
              <button
                type="button"
                onClick={() => setRoleOpen(!roleOpen)}
                className="w-full h-9 pl-10 pr-3 text-sm bg-[#f3f3f5] rounded-lg border border-transparent text-left text-[#495565] focus:outline-none outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              >
                {selectedRole}
              </button>
              {roleOpen && (
                <div className="absolute top-full mt-1 left-0 right-0 bg-white border border-black/10 rounded-lg shadow-lg z-20">
                  {(['Student', 'Instructor'] as const).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => {
                        setValue('role', r, { shouldValidate: true })
                        setRoleOpen(false)
                      }}
                      className={`w-full px-4 py-2 text-sm text-left hover:bg-[#f3f3f5] first:rounded-t-lg last:rounded-b-lg focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none ${
                        selectedRole === r ? 'text-[#4f39f6] font-medium' : 'text-[#495565]'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <p className="text-xs text-[#697282] mt-1">Learn and enroll in courses</p>
          </div>

          <div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9ca3af]" size={16} />
              <input
                {...register('password')}
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                autoComplete="new-password"
                className="w-full h-9 pl-10 pr-10 text-sm bg-[#f3f3f5] rounded-lg border border-transparent text-[#495565] placeholder:text-[#717182] focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9ca3af] focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
            )}
          </div>

          <div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9ca3af]" size={16} />
              <input
                {...register('confirmPassword')}
                type={showConfirm ? 'text' : 'password'}
                placeholder="Confirm Password"
                autoComplete="new-password"
                className="w-full h-9 pl-10 pr-10 text-sm bg-[#f3f3f5] rounded-lg border border-transparent text-[#495565] placeholder:text-[#717182] focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9ca3af] focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none"
                tabIndex={-1}
              >
                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-xs text-red-500 mt-1">{errors.confirmPassword.message}</p>
            )}
          </div>

          <div>
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                {...register('agreed')}
                className="mt-0.5 accent-[#4f39f6] focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none"
              />
              <span className="text-sm text-[#495565]">
                I agree to{' '}
                <a href="#" className="text-[#4f39f6] font-medium focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-[#4f39f6] font-medium focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none">
                  Privacy Policy
                </a>
              </span>
            </label>
            {errors.agreed && (
              <p className="text-xs text-red-500 mt-1">{errors.agreed.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#4f39f6] hover:bg-[#4f39f6]/95 disabled:opacity-60 text-white rounded-lg min-h-11 text-sm font-medium shadow-[0px_10px_20px_-10px_rgba(79,57,246,0.7)] flex items-center justify-center gap-2 focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none"
          >
            {isLoading && <Loader2 size={16} className="animate-spin" />}
            {isLoading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-black/10" />
          <span className="text-xs text-[#697282]">Or sign up with</span>
          <div className="flex-1 h-px bg-black/10" />
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            className="flex-1 h-10 flex items-center justify-center gap-2 border border-black/10 rounded-lg text-sm text-[#495565] hover:bg-[#f3f3f5] focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none"
          >
            <GoogleLogo />
            Google
          </button>
          <button
            type="button"
            className="flex-1 h-10 flex items-center justify-center gap-2 border border-black/10 rounded-lg text-sm text-[#495565] hover:bg-[#f3f3f5] focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none"
          >
            <GitHubLogo />
            GitHub
          </button>
        </div>

        <p className="text-center text-sm text-[#495565] mt-5">
          Already have an account?{' '}
          <button
            type="button"
            onClick={() => navigate('/auth/login')}
            className="text-[#4f39f6] font-medium hover:underline focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none"
          >
            Sign in
          </button>
        </p>

        <div className="text-center mt-3">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="text-xs text-[#697282] hover:text-[#495565] focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  )
}

function GoogleLogo() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  )
}

function GitHubLogo() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="#24292F">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.694.825.577C20.565 21.795 24 17.295 24 12 24 5.37 18.63 0 12 0z" />
    </svg>
  )
}
