import { useState, useEffect } from 'react'
import type { DashboardData } from '@/shared/types'
import { repos } from '@/core/domain/di'

export function useUserDashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    repos.dashboard.getDashboardData('1').then((result) => {
      if (cancelled) return
      setData(result)
      setIsLoading(false)
    }).catch(() => {
      if (cancelled) return
      setError('Failed to load dashboard data')
      setIsLoading(false)
    })

    return () => { cancelled = true }
  }, [])

  return { data, isLoading, error }
}
