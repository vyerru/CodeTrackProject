import type { User, UserRole } from '../entities/User'

export interface IUserRepository {
  findAll(role?: UserRole): Promise<User[]>
  findById(id: string): Promise<User | null>
}
