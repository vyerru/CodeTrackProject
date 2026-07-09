import type { Transaction, TransactionItem } from '../entities/Transaction'

export interface CreateTransactionParams {
  userId: string
  customerName: string
  customerEmail?: string
  customerPhone?: string
  customerAddress?: string
  items: TransactionItem[]
  amount: number
  paymentMethod: string
}

export interface UpdateTransactionParams {
  status?: TransactionStatus
  paymentMethod?: string
}

export interface ITransactionRepository {
  findAll(): Promise<Transaction[]>
  findByUserId(userId: string): Promise<Transaction[]>
  create(params: CreateTransactionParams): Promise<Transaction>
  update(id: string, params: UpdateTransactionParams): Promise<Transaction>
  delete(id: string): Promise<void>
}
