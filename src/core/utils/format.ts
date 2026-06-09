export function formatRupiah(amount: number): string {
  return `Rp ${amount.toLocaleString('id-ID')}`
}

export function formatRupiahShort(amount: number): string {
  if (amount >= 1000000) return `Rp ${(amount / 1000000).toFixed(1)}M`
  if (amount >= 1000) return `Rp ${(amount / 1000).toFixed(0)}k`
  return `Rp ${amount}`
}

export function getRelativeTime(dateString: string): string {
  const now = new Date()
  const date = new Date(dateString)
  const diffMs = now.getTime() - date.getTime()
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  if (diffHours < 1) return `${Math.floor(diffMs / (1000 * 60))} minutes ago`
  if (diffHours < 24) return `${diffHours} hours ago`
  const diffDays = Math.floor(diffHours / 24)
  if (diffDays === 1) return '1 day ago'
  return `${diffDays} days ago`
}
