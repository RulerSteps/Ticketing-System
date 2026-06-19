import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './LoginPage.css'

const modules = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    ),
    title: 'Gestion des tickets',
    desc: 'Créez, assignez et suivez vos incidents',
    color: '#3b82f6',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
    title: 'Tableau de bord',
    desc: 'Statistiques et indicateurs de performance',
    color: '#10b981',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" />
      </svg>
    ),
    title: 'IA Intelligente',
    desc: 'Analyse automatique de la criticité',
    color: '#8b5cf6',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    title: 'Utilisateurs & Rôles',
    desc: 'Contrôle d\'accès RBAC précis',
    color: '#f59e0b',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </svg>
    ),
    title: 'Notifications',
    desc: 'Alertes en temps réel',
    color: '#ec4899',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
      </svg>
    ),
    title: 'Rapports & Export',
    desc: 'Exportez et analysez vos données',
    color: '#14b8a6',
  },
]

export default function LoginPage() {
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
      if (role.includes('administrateur')) {
        logout()
        setError('Les administrateurs doivent se connecter via l\'espace dédié.')
        return
      }
      if (role.includes('technicien')) navigate('/assigned', { replace: true })
      else navigate('/tickets', { replace: true })
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
              <div className="login-brand-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
              </div>
              <span className="login-brand-text">TicketSystem<span className="login-brand-dot" /></span>
            </div>

            <div className="login-header">
              <h1>Connexion</h1>
              <p className="login-subtitle">
                Pas encore de compte ? <Link to="/register">Créer un compte</Link>
              </p>
            </div>

            <form className="login-form" onSubmit={handleSubmit}>
              {error && <div className="login-error">{error}</div>}

              <div className="lfield">
                <label htmlFor="email">Adresse email</label>
                <div className="linput-wrap">
                  <svg className="linput-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
                  </svg>
                  <input id="email" name="email" type="email" placeholder="exemple@gmail.com" value={form.email} onChange={handleChange} autoComplete="email" />
                </div>
              </div>

              <div className="lfield">
                <label htmlFor="password">Mot de passe</label>
                <div className="linput-wrap">
                  <svg className="linput-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  <input id="password" name="password" type={showPassword ? 'text' : 'password'} placeholder="Entrez votre mot de passe" value={form.password} onChange={handleChange} autoComplete="current-password" />
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

              <div className="login-options">
                <Link to="/forgot-password" className="login-forgot">Mot de passe oublié ?</Link>
              </div>

              <button type="submit" className="login-btn" disabled={loading}>
                <span>{loading ? 'Connexion en cours...' : 'Se connecter'}</span>
              </button>
            </form>


          </div>
        </div>

        <div className="login-hero-side">
          <div className="login-hero-content">
            <div className="lhero-badge">
              <span className="lhero-badge-dot" />
              Ticketing IT
            </div>
            <h2 className="lhero-title">
              Bienvenue sur <span className="lhero-highlight">TicketSystem</span>
            </h2>
            <p className="lhero-desc">
              La plateforme centralisée de gestion des incidents informatiques.
              Suivez, priorisez et résolvez vos tickets efficacement.
            </p>

            <div className="lhero-grid">
              {modules.map((mod, i) => (
                <div key={i} className="lmodule-card" style={{ '--card-accent': mod.color }}>
                  <div className="lmodule-icon" style={{ background: `${mod.color}15`, color: mod.color }}>
                    {mod.icon}
                  </div>
                  <h4 className="lmodule-title">{mod.title}</h4>
                  <p className="lmodule-desc">{mod.desc}</p>
                </div>
              ))}
            </div>

            <div className="lhero-team">
              <div className="lteam-avatars">
                {['W', 'M', 'L', 'A'].map((letter, i) => (
                  <div key={i} className="lteam-avatar" style={{
                    background: ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b'][i],
                    zIndex: 4 - i
                  }}>
                    {letter}
                  </div>
                ))}
              </div>
              <span className="lteam-text">Équipe GLSI2 — Projet Ticketing IT</span>
            <div className="login-roles-info" style={{ justifyContent: 'center', marginTop: 16 }}>
              <a href="/admin/login" style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseOver={e => e.target.style.color = 'rgba(255,255,255,0.7)'}
                onMouseOut={e => e.target.style.color = 'rgba(255,255,255,0.4)'}>
                Espace administrateur →
              </a>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  )
}
