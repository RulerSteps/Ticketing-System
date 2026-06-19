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
    desc: "Contrôle d'accès RBAC précis",
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

export default function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    nom: '', prenom: '', email: '', telephone: '', password: '', confirmPassword: '', role: 'utilisateur'
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.nom || !form.prenom || !form.email || !form.password) {
      setError('Veuillez remplir tous les champs obligatoires')
      return
    }
    if (form.password !== form.confirmPassword) {
      setError('Les mots de passe ne correspondent pas')
      return
    }
    if (form.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères')
      return
    }
    setLoading(true)
    try {
      await register({
        nom: form.nom,
        prenom: form.prenom,
        email: form.email,
        telephone: form.telephone,
        mot_de_passe: form.password,
        role: form.role,
      })
      setSuccess(true)
      setTimeout(() => navigate('/login'), 2000)
    } catch (err) {
      setError(err.message || "Erreur lors de l'inscription")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="login-page">
        <div className="login-bg-grid" />
        <div className="login-bg-glow" />
        <div className="login-bg-glow-2" />
        <div className="login-layout">
          <div className="login-form-side">
            <div className="login-form-container" style={{ textAlign: 'center' }}>
              <div className="login-header">
                <div className="login-brand-icon" style={{ margin: '0 auto 20px', background: 'linear-gradient(135deg, #059669, #10b981)' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <h1>Inscription réussie !</h1>
                <p style={{ marginTop: 8, color: 'rgba(255,255,255,0.45)', fontSize: 14 }}>
                  Vous allez être redirigé vers la page de connexion.
                </p>
              </div>
            </div>
          </div>
          <div className="login-hero-side">
            <div className="login-hero-content">
              <div className="lhero-badge"><span className="lhero-badge-dot" />Ticketing IT</div>
              <h2 className="lhero-title">Bienvenue sur <span className="lhero-highlight">TicketSystem</span></h2>
              <p className="lhero-desc">La plateforme centralisée de gestion des incidents informatiques. Suivez, priorisez et résolvez vos tickets efficacement.</p>
              <div className="lhero-grid" style={{ marginTop: 24 }}>
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
              <div className="lhero-team" style={{ marginTop: 32 }}>
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
              </div>
            </div>
          </div>
        </div>
      </div>
    )
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
                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="8.5" cy="7" r="4" /><line x1="20" y1="8" x2="20" y2="14" /><line x1="23" y1="11" x2="17" y2="11" />
                </svg>
              </div>
              <span className="login-brand-text">TicketSystem<span className="login-brand-dot" /></span>
            </div>

            <div className="login-header">
              <h1>Inscription</h1>
              <p className="login-subtitle">
                Déjà un compte ? <Link to="/login">Se connecter</Link>
              </p>
            </div>

            <form className="login-form" onSubmit={handleSubmit}>
              {error && <div className="login-error">{error}</div>}

              <div className="lfields-row">
                <div className="lfield">
                  <label htmlFor="prenom">Prénom *</label>
                  <div className="linput-wrap">
                    <input id="prenom" name="prenom" type="text" placeholder="Votre prénom" value={form.prenom} onChange={handleChange} style={{ paddingLeft: 14 }} />
                  </div>
                </div>
                <div className="lfield">
                  <label htmlFor="nom">Nom *</label>
                  <div className="linput-wrap">
                    <input id="nom" name="nom" type="text" placeholder="Votre nom" value={form.nom} onChange={handleChange} style={{ paddingLeft: 14 }} />
                  </div>
                </div>
              </div>

              <div className="lfield">
                <label htmlFor="email">Email *</label>
                <div className="linput-wrap">
                  <svg className="linput-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
                  </svg>
                  <input id="email" name="email" type="email" placeholder="exemple@gmail.com" value={form.email} onChange={handleChange} autoComplete="email" />
                </div>
              </div>

              <div className="lfield">
                <label htmlFor="telephone">Téléphone</label>
                <div className="linput-wrap">
                  <svg className="linput-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  <input id="telephone" name="telephone" type="tel" placeholder="+221 77 123 45 67" value={form.telephone} onChange={handleChange} />
                </div>
              </div>

              <div className="lfields-row">
                <div className="lfield">
                  <label htmlFor="password">Mot de passe *</label>
                  <div className="linput-wrap">
                    <input id="password" name="password" type={showPassword ? 'text' : 'password'} placeholder="Min 6 car." value={form.password} onChange={handleChange} autoComplete="new-password" style={{ paddingLeft: 14 }} />
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
                <div className="lfield">
                  <label htmlFor="confirmPassword">Confirmation *</label>
                  <div className="linput-wrap">
                    <input id="confirmPassword" name="confirmPassword" type={showConfirm ? 'text' : 'password'} placeholder="Confirmez" value={form.confirmPassword} onChange={handleChange} autoComplete="new-password" style={{ paddingLeft: 14 }} />
                    <button type="button" className="lpassword-toggle" onClick={() => setShowConfirm(!showConfirm)} tabIndex={-1}>
                      {showConfirm ? (
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
              </div>

              <div className="lfield" style={{ marginBottom: 20 }}>
                <label>Vous êtes ?</label>
                <div className="login-role-toggle">
                  <button
                    type="button"
                    className={`lrole-btn ${form.role === 'utilisateur' ? 'active' : ''}`}
                    onClick={() => setForm({ ...form, role: 'utilisateur' })}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                    </svg>
                    Utilisateur
                  </button>
                  <button
                    type="button"
                    className={`lrole-btn ${form.role === 'technicien' ? 'active' : ''}`}
                    onClick={() => setForm({ ...form, role: 'technicien' })}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="8.5" cy="7" r="4" /><polyline points="17 11 19 13 23 9" />
                    </svg>
                    Technicien
                  </button>
                </div>
              </div>

              <button type="submit" className="login-btn" disabled={loading}>
                <span>{loading ? 'Inscription...' : 'Créer mon compte'}</span>
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
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
