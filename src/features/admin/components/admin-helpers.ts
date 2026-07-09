import type { UserRole } from '@/shared/types'

export const categories = [
  'Web Development',
  'Data Science',
  'Mobile Development',
  'Backend Development',
  'DevOps',
  'Cloud Computing',
  'Design',
]

export const levels = ['Beginner', 'Intermediate', 'Advanced'] as const

export function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function getInitials(name: string) {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
}

export function getRoleBadgeClass(role: UserRole): string {
  switch (role) {
    case 'student': return 'border border-gray-300 text-gray-600'
    case 'instructor': return 'bg-blue-500 text-white'
    case 'admin': return 'bg-indigo-500 text-white'
  }
}

export function getStatusBadgeClass(status: string): string {
  return status === 'Active' ? 'bg-green-500 text-white' : 'bg-gray-400 text-white'
}