import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const AuthContext = createContext(null)

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedToken = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')
    if (storedToken && storedUser) {
      setToken(storedToken)
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const login = useCallback(async (email, password) => {
    // MOCK LOGIN POUR TESTER SANS BACKEND
    if (email === 'technicien@test.com' || email === 'tech@test.com') {
      const mockData = {
        token: 'mock-jwt-token',
        user: { id: 2, email, nom: 'Malick', role: 'technicien' }
      }
      localStorage.setItem('token', mockData.token)
      localStorage.setItem('user', JSON.stringify(mockData.user))
      setToken(mockData.token)
      setUser(mockData.user)
      return mockData
    }

    if (email === 'user@test.com' || email === 'utilisateur@test.com') {
      const mockData = {
        token: 'mock-jwt-token-user',
        user: { id: 3, email, nom: 'Awa Ndiaye', role: 'utilisateur' }
      }
      localStorage.setItem('token', mockData.token)
      localStorage.setItem('user', JSON.stringify(mockData.user))
      setToken(mockData.token)
      setUser(mockData.user)
      return mockData
    }

    if (email === 'admin@test.com') {
      const mockData = {
        token: 'mock-jwt-token-admin',
        user: { id: 1, email, nom: 'Admin', role: 'administrateur' }
      }
      localStorage.setItem('token', mockData.token)
      localStorage.setItem('user', JSON.stringify(mockData.user))
      setToken(mockData.token)
      setUser(mockData.user)
      return mockData
    }

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Erreur de connexion')
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      setToken(data.token)
      setUser(data.user)
      return data
    } catch (err) {
      throw new Error(err.message === 'Failed to fetch' ? "Le serveur backend n'est pas lancé. Utilisez user@test.com, tech@test.com ou admin@test.com pour tester." : err.message || 'Erreur de connexion')
    }
  }, [])

  const register = useCallback(async (userData) => {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...userData, role: userData.role || 'utilisateur' }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message || "Erreur d'inscription")
    return data
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setToken(null)
    setUser(null)
  }, [])

  const hasRole = useCallback((roles) => {
    if (!user) return false
    const userRole = user.role?.nom?.toLowerCase() || user.role?.toLowerCase() || ''
    if (Array.isArray(roles)) return roles.some(r => userRole.includes(r.toLowerCase()))
    return userRole.includes(roles.toLowerCase())
  }, [user])

  const value = { user, token, loading, login, register, logout, hasRole, isAuthenticated: !!token }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
