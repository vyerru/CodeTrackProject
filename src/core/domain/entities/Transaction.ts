export type TransactionStatus = 'success' | 'pending' | 'failed'

export interface Transaction {
  id: string
  invoice: string
  userId: string
  customerName: string
  courseId: string
  courseTitle: string
  amount: number
  status: TransactionStatus
  createdAt: string
  paymentMethod: string
}
