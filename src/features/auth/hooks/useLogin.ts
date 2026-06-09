import { useState, useCallback } from 'react'
import { repos } from '@/core/domain/di'

export function useLogin() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true)
    setError(null)

    const user = await repos.auth.login({ email, password })

    if (!user) {
      setError('Invalid email or password')
      setIsLoading(false)
      return null
    }

    setIsLoading(false)
    return user
  }, [])

  const resetError = useCallback(() => setError(null), [])

  return { login, isLoading, error, resetError }
}
