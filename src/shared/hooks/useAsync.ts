import { useState, useEffect, useRef, useCallback } from 'react'

interface AsyncState<T> {
  data: T | null
  isLoading: boolean
  error: string | null
}

export function useAsync<T>(fetcher: () => Promise<T>): AsyncState<T> & { refetch: () => void } {
  const [data, setData] = useState<T | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const fetcherRef = useRef(fetcher)

  useEffect(() => {
    fetcherRef.current = fetcher
  })

  useEffect(() => {
    let cancelled = false

    fetcherRef
      .current()
      .then((result) => {
        if (!cancelled) {
          setData(result)
          setIsLoading(false)
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Terjadi kesalahan')
          setIsLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [])

  const refetch = useCallback(() => {
    setIsLoading(true)
    setError(null)

    fetcherRef
      .current()
      .then((result) => {
        setData(result)
        setIsLoading(false)
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'Terjadi kesalahan')
        setIsLoading(false)
      })
  }, [])

  return { data, isLoading, error, refetch }
}
