export type TransactionStatus = 'success' | 'pending' | 'failed'

export interface TransactionItem {
  id: string
  title: string
  price: number
  quantity: number
}

export interface Transaction {
  id: string
  invoice: string
  userId: string
  customerName: string
  customerEmail?: string
  customerPhone?: string
  customerAddress?: string
  courseId: string
  courseTitle: string
  amount: number
  status: TransactionStatus
  createdAt: string
  paymentMethod: string
  items?: TransactionItem[]
}
