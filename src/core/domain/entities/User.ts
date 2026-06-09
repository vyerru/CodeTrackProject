export type UserRole = 'user' | 'admin'

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role: UserRole
  createdAt: string
}
