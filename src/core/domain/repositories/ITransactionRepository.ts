import type { Transaction } from '../entities/Transaction'

export interface CreateTransactionParams {
  userId: string
  customerName: string
  courseId: string
  courseTitle: string
  amount: number
  paymentMethod: string
}

export interface ITransactionRepository {
  findAll(): Promise<Transaction[]>
  findByUserId(userId: string): Promise<Transaction[]>
  create(params: CreateTransactionParams): Promise<Transaction>
}
