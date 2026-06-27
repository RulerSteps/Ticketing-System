/* eslint-disable react-refresh/only-export-components */

import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const AuthContext = createContext(null)

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
const MAX_ATTEMPTS = 5
const BLOCK_DURATION = 15 * 60 * 1000 // 15 minutes

function initAuth() {
  const storedToken = localStorage.getItem('token')
  const storedUser = localStorage.getItem('user')
  return {
    user: storedUser ? JSON.parse(storedUser) : null,
    token: storedToken || null,
  }
}

function getLoginAttempts(email) {
  const stored = localStorage.getItem('loginAttempts')
  const data = stored ? JSON.parse(stored) : {}
  const entry = data[email]
  if (!entry) return { count: 0, blockedUntil: null }
  if (entry.blockedUntil && Date.now() > entry.blockedUntil) {
    delete data[email]
    localStorage.setItem('loginAttempts', JSON.stringify(data))
    return { count: 0, blockedUntil: null }
  }
  return entry
}

function recordFailedAttempt(email) {
  const stored = localStorage.getItem('loginAttempts')
  const data = stored ? JSON.parse(stored) : {}
  const entry = data[email] || { count: 0, blockedUntil: null }
  entry.count += 1
  if (entry.count >= MAX_ATTEMPTS) {
    entry.blockedUntil = Date.now() + BLOCK_DURATION
  }
  data[email] = entry
  localStorage.setItem('loginAttempts', JSON.stringify(data))
  return entry
}

function resetAttempts(email) {
  const stored = localStorage.getItem('loginAttempts')
  const data = stored ? JSON.parse(stored) : {}
  delete data[email]
  localStorage.setItem('loginAttempts', JSON.stringify(data))
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => initAuth().user)
  const [token, setToken] = useState(() => initAuth().token)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(false)
  }, [])

  const login = useCallback(async (email, password) => {
    // Check if account is blocked
    const attempts = getLoginAttempts(email)
    if (attempts.blockedUntil) {
      const remaining = Math.ceil((attempts.blockedUntil - Date.now()) / 60000)
      throw new Error(`Compte temporairement bloqué. Réessayez dans ${remaining} minute(s).`)
    }

    // MOCK LOGIN POUR TESTER SANS BACKEND
    if (email === 'technicien@test.com' || email === 'tech@test.com') {
      resetAttempts(email)
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
      resetAttempts(email)
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
      resetAttempts(email)
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
      if (!res.ok) {
        const attempts = recordFailedAttempt(email)
        const remaining = MAX_ATTEMPTS - attempts.count
        if (remaining <= 0) {
          throw new Error(`Compte bloqué pour 15 minutes après ${MAX_ATTEMPTS} tentatives échouées.`)
        }
        throw new Error(`Email ou mot de passe incorrect. Il vous reste ${remaining} tentative(s).`)
      }
      resetAttempts(email)
      const data = await res.json()
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      setToken(data.token)
      setUser(data.user)
      return data
    } catch (err) {
      if (err.message === 'Failed to fetch') {
        throw new Error("Le serveur backend n'est pas lancé. Utilisez user@test.com, tech@test.com ou admin@test.com pour tester.", { cause: err })
      }
      throw err
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
