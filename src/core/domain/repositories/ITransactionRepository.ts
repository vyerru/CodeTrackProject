import type { Transaction } from '../entities/Transaction'

export interface ITransactionRepository {
  findAll(): Promise<Transaction[]>
  findByUserId(userId: string): Promise<Transaction[]>
}
