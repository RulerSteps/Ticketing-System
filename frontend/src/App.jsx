import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ProtectedRoute, PublicRoute } from './components/common/ProtectedRoute'
import { useAuth } from './context/AuthContext'
import LoginPage from './pages/LoginPage'
import AdminLoginPage from './pages/AdminLoginPage'
import RegisterPage from './pages/RegisterPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import NotFoundPage from './pages/NotFoundPage'
import AssignedTicketsPage from './pages/AssignedTicketsPage'
import TicketDetailPage from './pages/TicketDetailPage'
import MyTicketsPage from './pages/MyTicketsPage'
import NewTicketPage from './pages/NewTicketPage'
import ProfilePage from './pages/ProfilePage'
import DashboardAdmin from './pages/admin/DashboardAdmin'
import UserManagement from './pages/admin/UserManagement'
import CategoryManagement from './pages/admin/CategoryManagement'
import TicketAssignment from './pages/admin/TicketAssignment'

function RootRedirect() {
  const { hasRole, loading } = useAuth()
  if (loading) return null;
  if (hasRole('administrateur')) return <Navigate to="/dashboard" replace />
  if (hasRole('technicien')) return <Navigate to="/assigned" replace />
  return <Navigate to="/tickets" replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
          <Route path="/admin/login" element={<PublicRoute><AdminLoginPage /></PublicRoute>} />
          <Route path="/forgot-password" element={<PublicRoute><ForgotPasswordPage /></PublicRoute>} />

          <Route path="/dashboard" element={<ProtectedRoute roles={['administrateur']}><DashboardAdmin /></ProtectedRoute>} />
          <Route path="/tickets" element={<ProtectedRoute roles={['utilisateur', 'technicien', 'administrateur']}><MyTicketsPage /></ProtectedRoute>} />
          <Route path="/tickets/new" element={<ProtectedRoute roles={['utilisateur']}><NewTicketPage /></ProtectedRoute>} />
          <Route path="/tickets/:id" element={<ProtectedRoute roles={['utilisateur', 'technicien', 'administrateur']}><TicketDetailPage /></ProtectedRoute>} />
          <Route path="/assigned" element={<ProtectedRoute roles={['technicien', 'administrateur']}><AssignedTicketsPage /></ProtectedRoute>} />
          <Route path="/users" element={<ProtectedRoute roles={['administrateur']}><UserManagement /></ProtectedRoute>} />
          <Route path="/categories" element={<ProtectedRoute roles={['administrateur']}><CategoryManagement /></ProtectedRoute>} />
          <Route path="/admin/assign" element={<ProtectedRoute roles={['administrateur']}><TicketAssignment /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute roles={['utilisateur', 'technicien', 'administrateur']}><ProfilePage /></ProtectedRoute>} />

          <Route path="/" element={<RootRedirect />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
