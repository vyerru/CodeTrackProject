import type { ITransactionRepository, CreateTransactionParams } from '@/core/domain/repositories/ITransactionRepository'
import type { Transaction } from '@/core/domain/entities/Transaction'
import { transactions } from '../sources/mock'
import { delay } from './helpers'

export class MockTransactionRepository implements ITransactionRepository {
  async findAll(): Promise<Transaction[]> {
    await delay()
    return transactions as Transaction[]
  }

  async findByUserId(userId: string): Promise<Transaction[]> {
    await delay()
    return (transactions as Transaction[]).filter(t => t.userId === userId)
  }

  async create(params: CreateTransactionParams): Promise<Transaction> {
    await delay()
    const txn: Transaction = {
      id: String(Date.now()),
      invoice: `INV/${new Date().toISOString().slice(0, 10).replace(/-/g, '')}/${String((transactions as Transaction[]).length + 1).padStart(4, '0')}`,
      userId: params.userId,
      customerName: params.customerName,
      courseId: params.courseId,
      courseTitle: params.courseTitle,
      amount: params.amount,
      status: 'success',
      createdAt: new Date().toISOString(),
      paymentMethod: params.paymentMethod,
    }
    return txn
  }
}
