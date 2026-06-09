import type { ITransactionRepository } from '@/core/domain/repositories/ITransactionRepository'
import type { Transaction } from '@/core/domain/entities/Transaction'
import { transactions } from '../sources/mock'
import { delay } from './helpers'

export class MockTransactionRepository implements ITransactionRepository {
  async findAll(): Promise<Transaction[]> {
    await delay(400)
    return transactions as Transaction[]
  }

  async findByUserId(userId: string): Promise<Transaction[]> {
    await delay(300)
    return (transactions as Transaction[]).filter(t => t.userId === userId)
  }
}
