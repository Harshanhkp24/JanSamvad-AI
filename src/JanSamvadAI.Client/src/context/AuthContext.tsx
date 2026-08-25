import React, { createContext, useContext, useState, useEffect } from 'react'
import api from '../services/api'

export interface User {
  id: string
  email: string
  fullName: string
  phoneNumber?: string
  wardId?: number
  roles?: string[]
}

interface AuthContextType {
  user: User | null
  token: string | null
  loading: boolean
  login: (token: string, userData: User) => void
  logout: () => void
  hasRole: (role: string) => boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  loading: true,
  login: () => {},
  logout: () => {},
  hasRole: () => false
})

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      const storedToken = localStorage.getItem('token')
      if (!storedToken) {
        setUser(null)
        setLoading(false)
        return
      }

      try {
        const res = await api.get('/api/auth/me')
        if (res.data?.success && res.data?.data) {
          const u = res.data.data.user
          u.roles = res.data.data.roles || []
          setUser(u)
          setToken(storedToken)
        } else {
          logout()
        }
      } catch (err) {
        console.error('Failed to fetch authenticated user profile', err)
        logout()
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [])

  const login = (newToken: string, userData: User) => {
    localStorage.setItem('token', newToken)
    setToken(newToken)
    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
  }

  const hasRole = (role: string) => {
    return user?.roles?.includes(role) ?? false
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, hasRole }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
