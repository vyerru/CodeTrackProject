import { describe, it, expect } from 'vitest'
import { formatRupiah, formatRupiahShort, getRelativeTime } from './format'

describe('formatRupiah', () => {
  it('formats regular amounts', () => {
    expect(formatRupiah(299000)).toBe('Rp 299.000')
  })

  it('formats millions', () => {
    expect(formatRupiah(1250000000)).toBe('Rp 1.250.000.000')
  })

  it('formats zero', () => {
    expect(formatRupiah(0)).toBe('Rp 0')
  })

  it('formats small amounts', () => {
    expect(formatRupiah(500)).toBe('Rp 500')
  })
})

describe('formatRupiahShort', () => {
  it('formats millions as M', () => {
    expect(formatRupiahShort(1250000000)).toBe('Rp 1250.0M')
  })

  it('formats thousands as k', () => {
    expect(formatRupiahShort(589000)).toBe('Rp 589k')
  })

  it('formats small amounts as-is', () => {
    expect(formatRupiahShort(500)).toBe('Rp 500')
  })

  it('formats zero', () => {
    expect(formatRupiahShort(0)).toBe('Rp 0')
  })

  it('formats amounts in the millions range', () => {
    expect(formatRupiahShort(3500000)).toBe('Rp 3.5M')
  })
})

describe('getRelativeTime', () => {
  it('returns "x minutes ago" for recent dates', () => {
    const now = new Date()
    const fiveMinAgo = new Date(now.getTime() - 5 * 60 * 1000)
    expect(getRelativeTime(fiveMinAgo.toISOString())).toBe('5 minutes ago')
  })

  it('returns "1 minute ago" for one minute ago', () => {
    const now = new Date()
    const oneMinAgo = new Date(now.getTime() - 1 * 60 * 1000)
    expect(getRelativeTime(oneMinAgo.toISOString())).toBe('1 minutes ago')
  })

  it('returns "x hours ago" for recent hours', () => {
    const now = new Date()
    const threeHoursAgo = new Date(now.getTime() - 3 * 60 * 60 * 1000)
    expect(getRelativeTime(threeHoursAgo.toISOString())).toBe('3 hours ago')
  })

  it('returns "1 day ago" for yesterday', () => {
    const now = new Date()
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000)
    expect(getRelativeTime(yesterday.toISOString())).toBe('1 day ago')
  })

  it('returns "x days ago" for older dates', () => {
    const now = new Date()
    const fiveDaysAgo = new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000)
    expect(getRelativeTime(fiveDaysAgo.toISOString())).toBe('5 days ago')
  })
})