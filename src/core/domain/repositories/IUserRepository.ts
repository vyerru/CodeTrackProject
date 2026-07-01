import type { User, UserRole, UserStatus, UserDetail } from '../entities/User'

export interface CreateUserParams {
  name: string
  email: string
  password: string
  role: UserRole
  status: UserStatus
  avatar?: string
}

export interface UpdateUserParams {
  name?: string
  email?: string
  role?: UserRole
  status?: UserStatus
  avatar?: string | null
}

export interface IUserRepository {
  findAll(role?: UserRole): Promise<User[]>
  findById(id: string): Promise<User | null>
  create(params: CreateUserParams): Promise<User>
  update(id: string, params: UpdateUserParams): Promise<User>
  delete(id: string): Promise<void>
  getUserDetail(id: string): Promise<UserDetail | null>
}
