import { useState } from 'react'
import { Link } from 'react-router-dom'
import { forgotPassword } from '../services/ahmaApi'
import './LoginPage.css'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email.trim()) {
      setError('Veuillez saisir votre adresse email')
      return
    }
    setError('')
    setLoading(true)
    try {
      await forgotPassword(email)
      setSent(true)
    } catch {
      setError('Erreur lors de l\'envoi de l\'email. Veuillez reessayer.')
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
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
              <span className="login-brand-text">TicketSystem<span className="login-brand-dot" /></span>
            </div>

            <div className="login-header">
              <h1>Mot de passe oublie</h1>
              <p className="login-subtitle">
                <Link to="/login">Retour a la connexion</Link>
              </p>
            </div>

            {sent ? (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div className="login-brand-icon" style={{ margin: '0 auto 20px', background: 'linear-gradient(135deg, #059669, #10b981)', width: 56, height: 56 }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <h2 style={{ marginBottom: 8, fontSize: '1.1rem' }}>Email envoye !</h2>
                <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 14, lineHeight: 1.5 }}>
                  Si un compte existe avec l'adresse <strong>{email}</strong>,<br />
                  vous recevrez un lien de reinitialisation.
                </p>
              </div>
            ) : (
              <form className="login-form" onSubmit={handleSubmit}>
                {error && <div className="login-error">{error}</div>}

                <div className="lfield">
                  <label htmlFor="reset-email">Adresse email</label>
                  <div className="linput-wrap">
                    <svg className="linput-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
                    </svg>
                    <input id="reset-email" name="email" type="email" placeholder="exemple@gmail.com" value={email} onChange={e => { setEmail(e.target.value); setError('') }} autoComplete="email" />
                  </div>
                </div>

                <button type="submit" className="login-btn" disabled={loading}>
                  <span>{loading ? 'Envoi en cours...' : 'Envoyer le lien'}</span>
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="login-hero-side">
          <div className="login-hero-content">
            <div className="lhero-badge"><span className="lhero-badge-dot" />Ticketing IT</div>
            <h2 className="lhero-title">Mot de passe <span className="lhero-highlight">oublie ?</span></h2>
            <p className="lhero-desc">
              Saisissez votre adresse email et nous vous enverrons un lien pour reinitialiser votre mot de passe.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
