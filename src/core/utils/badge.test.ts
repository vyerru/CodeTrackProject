import { describe, it, expect } from 'vitest'
import { getLevelColor, getStatusColor, getCategoryColor, getUrgencyColor } from './badge'

describe('getLevelColor', () => {
  it('returns green for Beginner', () => {
    expect(getLevelColor('Beginner')).toBe('bg-green-100 text-green-700')
  })

  it('returns blue for Intermediate', () => {
    expect(getLevelColor('Intermediate')).toBe('bg-blue-100 text-blue-700')
  })

  it('returns purple for Advanced', () => {
    expect(getLevelColor('Advanced')).toBe('bg-purple-100 text-purple-700')
  })

  it('returns gray default for unknown level', () => {
    expect(getLevelColor('Unknown')).toBe('bg-gray-100 text-gray-700')
  })
})

describe('getStatusColor', () => {
  it('returns green for success', () => {
    expect(getStatusColor('success')).toBe('bg-green-500 text-white')
  })

  it('returns amber for pending', () => {
    expect(getStatusColor('pending')).toBe('bg-amber-500 text-white')
  })

  it('returns red for failed', () => {
    expect(getStatusColor('failed')).toBe('bg-red-500 text-white')
  })

  it('returns gray default for unknown status', () => {
    expect(getStatusColor('unknown')).toBe('bg-gray-400 text-white')
  })
})

describe('getCategoryColor', () => {
  it('returns indigo for Web Development', () => {
    expect(getCategoryColor('Web Development')).toBe('bg-indigo-500')
  })

  it('returns emerald for Data Science', () => {
    expect(getCategoryColor('Data Science')).toBe('bg-emerald-500')
  })

  it('returns orange for DevOps', () => {
    expect(getCategoryColor('DevOps')).toBe('bg-orange-500')
  })

  it('returns pink for Design', () => {
    expect(getCategoryColor('Design')).toBe('bg-pink-500')
  })

  it('returns blue for Mobile Development', () => {
    expect(getCategoryColor('Mobile Development')).toBe('bg-blue-500')
  })

  it('returns purple for Backend Development', () => {
    expect(getCategoryColor('Backend Development')).toBe('bg-purple-500')
  })

  it('returns cyan for Cloud Computing', () => {
    expect(getCategoryColor('Cloud Computing')).toBe('bg-cyan-500')
  })

  it('returns gray default for unknown category', () => {
    expect(getCategoryColor('Unknown')).toBe('bg-gray-500')
  })
})

describe('getUrgencyColor', () => {
  it('returns red for high', () => {
    expect(getUrgencyColor('high')).toBe('bg-red-500 text-white')
  })

  it('returns amber for medium', () => {
    expect(getUrgencyColor('medium')).toBe('bg-amber-500 text-white')
  })

  it('returns gray for low', () => {
    expect(getUrgencyColor('low')).toBe('bg-gray-400 text-white')
  })

  it('returns gray default for unknown urgency', () => {
    expect(getUrgencyColor('unknown')).toBe('bg-gray-400 text-white')
  })
})