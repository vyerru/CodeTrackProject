import type { UserRole } from '../entities/User'

export interface LoginParams {
  email: string
  password: string
}

export interface RegisterParams {
  name: string
  email: string
  role: string
}

export interface LoginResult {
  id: string
  name: string
  email: string
  role: UserRole
}

export interface IAuthRepository {
  login(params: LoginParams): Promise<LoginResult | null>
  register(params: RegisterParams): Promise<LoginResult>
}
