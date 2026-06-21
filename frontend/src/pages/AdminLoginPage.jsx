import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './LoginPage.css'

export default function AdminLoginPage() {
  const { login, logout } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.email || !form.password) {
      setError('Veuillez remplir tous les champs')
      return
    }
    setLoading(true)
    try {
      const data = await login(form.email, form.password)
      const role = (data.user?.role?.nom || data.user?.role || '').toLowerCase()
      if (!role.includes('administrateur')) {
        logout()
        setError('Accès réservé aux administrateurs')
        return
      }
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setError(err.message || 'Email ou mot de passe incorrect')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-bg-grid" />
      <div className="login-bg-glow" />
      <div className="login-bg-glow-2" />

      <div className="login-layout">
        <div className="login-form-side">
          <div className="login-form-container">
            <div className="login-brand">
              <div className="login-brand-icon" style={{ background: 'linear-gradient(135deg, #7c3aed, #3b82f6)' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <span className="login-brand-text">TicketSystem<span className="login-brand-dot" /></span>
            </div>

            <div className="login-header">
              <h1>Administrateur</h1>
              <p className="login-subtitle">
                Espace réservé aux administrateurs
              </p>
            </div>

            <form className="login-form" onSubmit={handleSubmit}>
              {error && <div className="login-error">{error}</div>}

              <div className="lfield">
                <label htmlFor="admin-email">Adresse email</label>
                <div className="linput-wrap">
                  <svg className="linput-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
                  </svg>
                  <input id="admin-email" name="email" type="email" placeholder="admin@ticketsystem.com" value={form.email} onChange={handleChange} autoComplete="email" />
                </div>
              </div>

              <div className="lfield">
                <label htmlFor="admin-password">Mot de passe</label>
                <div className="linput-wrap">
                  <svg className="linput-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  <input id="admin-password" name="password" type={showPassword ? 'text' : 'password'} placeholder="Entrez votre mot de passe" value={form.password} onChange={handleChange} autoComplete="current-password" />
                  <button type="button" className="lpassword-toggle" onClick={() => setShowPassword(!showPassword)} tabIndex={-1}>
                    {showPassword ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <button type="submit" className="login-btn" disabled={loading} style={{ background: 'linear-gradient(135deg, #7c3aed, #3b82f6)' }}>
                <span>{loading ? 'Connexion en cours...' : 'Accéder à l\'espace admin'}</span>
              </button>
            </form>

            <div className="login-roles-info" style={{ justifyContent: 'center' }}>
              <a href="/login" style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseOver={e => e.target.style.color = 'rgba(255,255,255,0.7)'}
                onMouseOut={e => e.target.style.color = 'rgba(255,255,255,0.4)'}>
                ← Espace utilisateur / technicien
              </a>
            </div>
          </div>
        </div>

        <div className="login-hero-side">
          <div className="login-hero-content">
            <div className="lhero-badge" style={{ borderColor: 'rgba(124,58,237,0.3)' }}>
              <span className="lhero-badge-dot" style={{ background: '#7c3aed' }} />
              Administration
            </div>
            <h2 className="lhero-title">
              Panneau d'<span className="lhero-highlight" style={{ background: 'linear-gradient(135deg, #7c3aed, #3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Administration</span>
            </h2>
            <p className="lhero-desc">
              Gérez les utilisateurs, les catégories, les tickets et supervisez
              l'ensemble du système de ticketing IT.
            </p>

            <div className="lhero-grid">
              <div className="lmodule-card" style={{ '--card-accent': '#7c3aed' }}>
                <div className="lmodule-icon" style={{ background: 'rgba(124,58,237,0.08)', color: '#7c3aed' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
                <h4 className="lmodule-title">Utilisateurs & Rôles</h4>
                <p className="lmodule-desc">Gestion des comptes et permissions RBAC</p>
              </div>
              <div className="lmodule-card" style={{ '--card-accent': '#3b82f6' }}>
                <div className="lmodule-icon" style={{ background: 'rgba(59,130,246,0.08)', color: '#3b82f6' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" />
                  </svg>
                </div>
                <h4 className="lmodule-title">Tableau de bord</h4>
                <p className="lmodule-desc">Statistiques et KPI en temps réel</p>
              </div>
              <div className="lmodule-card" style={{ '--card-accent': '#10b981' }}>
                <div className="lmodule-icon" style={{ background: 'rgba(16,185,129,0.08)', color: '#10b981' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
                  </svg>
                </div>
                <h4 className="lmodule-title">Tickets</h4>
                <p className="lmodule-desc">Supervision de tous les incidents</p>
              </div>
              <div className="lmodule-card" style={{ '--card-accent': '#f59e0b' }}>
                <div className="lmodule-icon" style={{ background: 'rgba(245,158,11,0.08)', color: '#f59e0b' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <h4 className="lmodule-title">Catégories</h4>
                <p className="lmodule-desc">Structuration et classification</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
