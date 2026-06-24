import { useEffect, useState } from 'react'

export interface User {
  _id: string
  email: string
  username: string
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchUser()
  }, [])

  const fetchUser = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`)
      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
      } else {
        setUser(null)
      }
    } catch (err) {
      console.error('[v0] Error fetching user:', err)
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      setError(null)
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Login failed')
      }

      setUser(data.user)
      return data
    } catch (err: any) {
      const message = err.message || 'Login failed'
      setError(message)
      throw err
    }
  }

  const signup = async (email: string, username: string, password: string) => {
    try {
      setError(null)
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, username, password }),
        credentials: 'include',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Signup failed')
      }

      setUser(data.user)
      return data
    } catch (err: any) {
      const message = err.message || 'Signup failed'
      setError(message)
      throw err
    }
  }

  const logout = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      })
      setUser(null)
    } catch (err) {
      console.error('[v0] Error logging out:', err)
    }
  }

  return {
    user,
    isLoading,
    error,
    login,
    signup,
    logout,
    isAuthenticated: !!user,
  }
}
