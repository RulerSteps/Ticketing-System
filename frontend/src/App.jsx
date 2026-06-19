import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ProtectedRoute, PublicRoute } from './components/common/ProtectedRoute'
import { useState, useCallback } from 'react'
import LoginPage from './pages/LoginPage'
import AdminLoginPage from './pages/AdminLoginPage'
import RegisterPage from './pages/RegisterPage'

import NotFoundPage from './pages/NotFoundPage'
import Sidebar from './components/layout/Sidebar'
import Navbar from './components/layout/Navbar'

function DashboardPlaceholder() {
  return (
    <div style={{ padding: 32, textAlign: 'center' }}>
      <h2>Tableau de bord</h2>
      <p style={{ color: 'var(--color-text-light)', marginTop: 8 }}>Espace Administrateur</p>
    </div>
  )
}

function TicketsPlaceholder() {
  return (
    <div style={{ padding: 32, textAlign: 'center' }}>
      <h2>Mes tickets</h2>
      <p style={{ color: 'var(--color-text-light)', marginTop: 8 }}>Liste de mes tickets</p>
    </div>
  )
}

function NewTicketPlaceholder() {
  return (
    <div style={{ padding: 32, textAlign: 'center' }}>
      <h2>Créer un ticket</h2>
      <p style={{ color: 'var(--color-text-light)', marginTop: 8 }}>Formulaire de création</p>
    </div>
  )
}

function AssignedPlaceholder() {
  return (
    <div style={{ padding: 32, textAlign: 'center' }}>
      <h2>Tickets assignés</h2>
      <p style={{ color: 'var(--color-text-light)', marginTop: 8 }}>Espace Technicien</p>
    </div>
  )
}

function UsersPlaceholder() {
  return (
    <div style={{ padding: 32, textAlign: 'center' }}>
      <h2>Gestion des utilisateurs</h2>
      <p style={{ color: 'var(--color-text-light)', marginTop: 8 }}>Espace Administrateur</p>
    </div>
  )
}

function CategoriesPlaceholder() {
  return (
    <div style={{ padding: 32, textAlign: 'center' }}>
      <h2>Gestion des catégories</h2>
      <p style={{ color: 'var(--color-text-light)', marginTop: 8 }}>Espace Administrateur</p>
    </div>
  )
}

function ProfilePlaceholder() {
  return (
    <div style={{ padding: 32, textAlign: 'center' }}>
      <h2>Mon profil</h2>
      <p style={{ color: 'var(--color-text-light)', marginTop: 8 }}>Modifier mon profil</p>
    </div>
  )
}

function PreviewLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const toggleSidebar = useCallback(() => setSidebarOpen(prev => !prev), [])
  const closeSidebar = useCallback(() => setSidebarOpen(false), [])
  return (
    <div className="app-layout">
      <Sidebar sidebarOpen={sidebarOpen} closeSidebar={closeSidebar} />
      {sidebarOpen && <div className="sidebar-overlay" onClick={closeSidebar} />}
      <div className="app-content">
        <Navbar toggleSidebar={toggleSidebar} />
        <main className="app-main" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: 64, height: 64, borderRadius: 16, background: 'linear-gradient(135deg, rgba(59,130,246,0.15), rgba(139,92,246,0.15))', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <h2 style={{ marginBottom: 8 }}>Layout Preview</h2>
            <p style={{ color: 'var(--color-text-light)', maxWidth: 400 }}>
              Ceci est un aperçu du layout avec Sidebar et Navbar. Redimensionne la fenêtre pour voir le comportement responsive.
            </p>
          </div>
        </main>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
          <Route path="/admin/login" element={<PublicRoute><AdminLoginPage /></PublicRoute>} />
          <Route path="/forgot-password" element={<PublicRoute><LoginPage /></PublicRoute>} />
          <Route path="/preview-layout" element={<PreviewLayout />} />


          <Route path="/dashboard" element={<ProtectedRoute roles={['administrateur']}><DashboardPlaceholder /></ProtectedRoute>} />
          <Route path="/tickets" element={<ProtectedRoute roles={['utilisateur', 'technicien', 'administrateur']}><TicketsPlaceholder /></ProtectedRoute>} />
          <Route path="/tickets/new" element={<ProtectedRoute roles={['utilisateur', 'technicien', 'administrateur']}><NewTicketPlaceholder /></ProtectedRoute>} />
          <Route path="/assigned" element={<ProtectedRoute roles={['technicien', 'administrateur']}><AssignedPlaceholder /></ProtectedRoute>} />
          <Route path="/users" element={<ProtectedRoute roles={['administrateur']}><UsersPlaceholder /></ProtectedRoute>} />
          <Route path="/categories" element={<ProtectedRoute roles={['administrateur']}><CategoriesPlaceholder /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute roles={['utilisateur', 'technicien', 'administrateur']}><ProfilePlaceholder /></ProtectedRoute>} />

          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
