import { useState, useCallback } from 'react'
import { repos } from '@/core/domain/di'

interface RegisterParams {
  name: string
  email: string
  role: string
}

export function useRegister() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const register = useCallback(async (params: RegisterParams) => {
    setIsLoading(true)
    setError(null)

    const result = await repos.auth.register(params)

    setIsLoading(false)
    return result
  }, [])

  return { register, isLoading, error }
}
