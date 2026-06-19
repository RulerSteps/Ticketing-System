import { useState, useCallback } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Sidebar from '../layout/Sidebar'
import Navbar from '../layout/Navbar'

export function ProtectedRoute({ children, roles }) {
  const { isAuthenticated, hasRole, loading } = useAuth()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const toggleSidebar = useCallback(() => setSidebarOpen(prev => !prev), [])
  const closeSidebar = useCallback(() => setSidebarOpen(false), [])

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (roles && roles.length > 0 && !hasRole(roles)) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <div className="app-layout">
      <Sidebar sidebarOpen={sidebarOpen} closeSidebar={closeSidebar} />
      {sidebarOpen && <div className="sidebar-overlay" onClick={closeSidebar} />}
      <div className="app-content">
        <Navbar toggleSidebar={toggleSidebar} />
        <main className="app-main">
          {children}
        </main>
      </div>
    </div>
  )
}

export function PublicRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner" />
      </div>
    )
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}
