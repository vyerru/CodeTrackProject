// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useAsync } from './useAsync'

afterEach(() => {
  vi.restoreAllMocks()
})

describe('useAsync', () => {
  it('returns loading state initially', () => {
    const fetcher = vi.fn().mockImplementation(() => new Promise(() => {}))
    const { result } = renderHook(() => useAsync(fetcher))
    expect(result.current.isLoading).toBe(true)
    expect(result.current.data).toBeNull()
    expect(result.current.error).toBeNull()
  })

  it('returns data on successful fetch', async () => {
    const fetcher = vi.fn().mockResolvedValue('test data')
    const { result } = renderHook(() => useAsync(fetcher))

    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current.data).toBe('test data')
    expect(result.current.error).toBeNull()
  })

  it('returns error on failed fetch', async () => {
    const fetcher = vi.fn().mockRejectedValue(new Error('Network error'))
    const { result } = renderHook(() => useAsync(fetcher))

    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current.data).toBeNull()
    expect(result.current.error).toBe('Network error')
  })

  it('handles non-Error rejection', async () => {
    const fetcher = vi.fn().mockRejectedValue('string error')
    const { result } = renderHook(() => useAsync(fetcher))

    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current.error).toBe('Terjadi kesalahan')
  })

  it('refetch refetches data', async () => {
    const fetcher = vi.fn().mockResolvedValue('initial')
    const { result } = renderHook(() => useAsync(fetcher))

    await waitFor(() => expect(result.current.data).toBe('initial'))

    fetcher.mockResolvedValue('refetched')
    result.current.refetch()

    await waitFor(() => expect(result.current.data).toBe('refetched'))
    expect(fetcher).toHaveBeenCalledTimes(2)
  })

  it('cancels fetch on unmount', async () => {
    const fetcher = vi.fn().mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve('data'), 1000))
    )
    const { result, unmount } = renderHook(() => useAsync(fetcher))
    unmount()

    // Should not update state after unmount
    await new Promise((r) => setTimeout(r, 1100))
    expect(result.current.isLoading).toBe(true)
    expect(result.current.data).toBeNull()
  })
})