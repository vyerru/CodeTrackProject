import type { ITransactionRepository, CreateTransactionParams, UpdateTransactionParams } from '@/core/domain/repositories/ITransactionRepository'
import type { Transaction } from '@/core/domain/entities/Transaction'
import { transactions } from '../sources/mock'
import { delay } from './helpers'

export class MockTransactionRepository implements ITransactionRepository {
  private items: Transaction[]

  constructor() {
    this.items = (transactions as Transaction[]).map((t) => ({ ...t }))
  }

  async findAll(): Promise<Transaction[]> {
    await delay()
    return [...this.items]
  }

  async findByUserId(userId: string): Promise<Transaction[]> {
    await delay()
    return this.items.filter((t) => t.userId === userId)
  }

  async create(params: CreateTransactionParams): Promise<Transaction> {
    await delay()
    const { userId, customerName, customerEmail, customerPhone, customerAddress, items, amount, paymentMethod } = params
    const summaryTitle = items.map((i) => i.title).join(', ')
    const txn: Transaction = {
      id: String(Date.now()),
      invoice: `INV/${new Date().toISOString().slice(0, 10).replace(/-/g, '')}/${String(this.items.length + 1).padStart(4, '0')}`,
      userId,
      customerName,
      customerEmail,
      customerPhone,
      customerAddress,
      courseId: '',
      courseTitle: summaryTitle,
      amount,
      status: 'success',
      createdAt: new Date().toISOString(),
      paymentMethod,
      items,
    }
    this.items.push(txn)
    return txn
  }

  async update(id: string, params: UpdateTransactionParams): Promise<Transaction> {
    await delay()
    const index = this.items.findIndex((t) => t.id === id)
    if (index === -1) throw new Error('Transaksi tidak ditemukan')
    this.items[index] = { ...this.items[index], ...params }
    return this.items[index]
  }

  async delete(id: string): Promise<void> {
    await delay()
    const index = this.items.findIndex((t) => t.id === id)
    if (index === -1) throw new Error('Transaksi tidak ditemukan')
    this.items.splice(index, 1)
  }
}