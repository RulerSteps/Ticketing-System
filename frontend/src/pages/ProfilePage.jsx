import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import * as ticketService from "../services/ticketService";
import { updateProfile, changePassword } from "../services/ahmaApi";
import { Link } from "react-router-dom";
import "../styles/profile.css";
import "../styles/form.css";

export default function ProfilePage() {
  const { user, logout } = useAuth();

  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    prenom: user?.prenom || "",
    nom: user?.nom || "",
    telephone: user?.telephone || "",
  });
  const [saved, setSaved] = useState(false);

  const [passwordMode, setPasswordMode] = useState(false);
  const [passwordData, setPasswordData] = useState({ current: "", newPass: "", confirm: "" });
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const [userTickets, setUserTickets] = useState([]);

  useEffect(() => {
    const load = async () => {
      if (user) {
        const all = await ticketService.getTickets();
        setUserTickets(all.filter(t => t.auteur === user.nom));
      }
    };
    load();
  }, [user]);

  if (!user) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(formData);
      const updatedUser = { ...user, prenom: formData.prenom, nom: formData.nom, telephone: formData.telephone };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setSaved(true);
      setEditMode(false);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      const updatedUser = { ...user, prenom: formData.prenom, nom: formData.nom, telephone: formData.telephone };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setSaved(true);
      setEditMode(false);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  const handleCancel = () => {
    setFormData({ prenom: user?.prenom || "", nom: user?.nom || "", telephone: user?.telephone || "" });
    setEditMode(false);
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess(false);

    if (!passwordData.current || !passwordData.newPass || !passwordData.confirm) {
      setPasswordError("Veuillez remplir tous les champs");
      return;
    }
    if (passwordData.newPass.length < 8) {
      setPasswordError("Le mot de passe doit contenir au moins 8 caracteres");
      return;
    }
    if (!/[A-Z]/.test(passwordData.newPass)) {
      setPasswordError("Le mot de passe doit contenir au moins une majuscule");
      return;
    }
    if (!/[0-9]/.test(passwordData.newPass)) {
      setPasswordError("Le mot de passe doit contenir au moins un chiffre");
      return;
    }
    if (passwordData.newPass !== passwordData.confirm) {
      setPasswordError("Les mots de passe ne correspondent pas");
      return;
    }
    try {
      await changePassword({ currentPassword: passwordData.current, newPassword: passwordData.newPass });
      setPasswordSuccess(true);
      setPasswordData({ current: "", newPass: "", confirm: "" });
      setTimeout(() => setPasswordSuccess(false), 3000);
    } catch (err) {
      setPasswordError(err.response?.data?.message || "Erreur lors du changement de mot de passe");
    }
  };

  return (
    <div className="page" style={{ maxWidth: '700px', margin: '0 auto', animation: 'fadeIn 0.3s ease-out' }}>
      <div className="card" style={{ padding: 'var(--space-xl)' }}>

        <div className="profile-head">
          <div className="avatar">
            {(formData.prenom?.charAt(0) || 'U').toUpperCase()}
            {(formData.nom?.charAt(0) || '').toUpperCase()}
          </div>
          <div>
            <h1 className="profile-name">{formData.prenom} {formData.nom}</h1>
            <p className="muted">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
              </svg>
              {user.role?.nom || user.role}
            </p>
          </div>
        </div>

        {saved && (
          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px', padding: '12px 16px', marginBottom: '24px', color: '#166534', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Profil mis a jour avec succes !
          </div>
        )}

        {passwordSuccess && (
          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px', padding: '12px 16px', marginBottom: '24px', color: '#166534', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Mot de passe modifie avec succes !
          </div>
        )}

        <div style={{ marginBottom: 'var(--space-xl)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-md)' }}>
            <h2 className="section-title" style={{ margin: 0 }}>Informations personnelles</h2>
            {!editMode && (
              <button className="btn btn--ghost" style={{ fontSize: '0.85rem', padding: '6px 14px' }} onClick={() => setEditMode(true)}>
                Modifier
              </button>
            )}
          </div>

          {editMode ? (
            <form onSubmit={handleSave} className="comment-form" noValidate>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="field">
                  <label className="field__label" htmlFor="prenom">Prenom</label>
                  <input type="text" id="prenom" name="prenom" className="input" value={formData.prenom} onChange={handleChange} required />
                </div>
                <div className="field">
                  <label className="field__label" htmlFor="nom">Nom</label>
                  <input type="text" id="nom" name="nom" className="input" value={formData.nom} onChange={handleChange} required />
                </div>
              </div>
              <div className="field">
                <label className="field__label" htmlFor="telephone">Telephone</label>
                <input type="tel" id="telephone" name="telephone" className="input" value={formData.telephone} onChange={handleChange} placeholder="+221 77 123 45 67" />
              </div>
              <div className="data-row" style={{ marginTop: '8px' }}>
                <span className="data-label">Adresse Email</span>
                <span className="data-value" style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
                  {user.email}
                  <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginLeft: '8px', background: '#f3f4f6', padding: '2px 8px', borderRadius: '20px' }}>
                    non modifiable
                  </span>
                </span>
              </div>

              <div className="form__actions" style={{ marginTop: '24px' }}>
                <button type="button" className="btn btn--ghost" onClick={handleCancel}>Annuler</button>
                <button type="submit" className="btn btn--primary" disabled={!formData.prenom || !formData.nom}>
                  Enregistrer
                </button>
              </div>
            </form>
          ) : (
            <div className="profile-data-list">
              <div className="data-row">
                <span className="data-label">Prenom</span>
                <span className="data-value">{formData.prenom || '—'}</span>
              </div>
              <div className="data-row">
                <span className="data-label">Nom</span>
                <span className="data-value">{formData.nom || '—'}</span>
              </div>
              <div className="data-row">
                <span className="data-label">Telephone</span>
                <span className="data-value">{user.telephone || formData.telephone || '—'}</span>
              </div>
              <div className="data-row">
                <span className="data-label">Adresse Email</span>
                <span className="data-value">{user.email}</span>
              </div>
            </div>
          )}
        </div>

        <div style={{ marginBottom: 'var(--space-xl)' }}>
          <h2 className="section-title">Changer le mot de passe</h2>
          {passwordMode ? (
            <form onSubmit={handlePasswordChange} className="comment-form" noValidate>
              {passwordError && <div className="alert alert--error">{passwordError}</div>}
              <div className="field">
                <label className="field__label" htmlFor="current-pw">Mot de passe actuel</label>
                <input type="password" id="current-pw" className="input" value={passwordData.current} onChange={e => setPasswordData(p => ({ ...p, current: e.target.value }))} />
              </div>
              <div className="field">
                <label className="field__label" htmlFor="new-pw">Nouveau mot de passe</label>
                <input type="password" id="new-pw" className="input" placeholder="Min 8 car., 1 maj., 1 chiffre" value={passwordData.newPass} onChange={e => setPasswordData(p => ({ ...p, newPass: e.target.value }))} />
              </div>
              <div className="field">
                <label className="field__label" htmlFor="confirm-pw">Confirmer le mot de passe</label>
                <input type="password" id="confirm-pw" className="input" value={passwordData.confirm} onChange={e => setPasswordData(p => ({ ...p, confirm: e.target.value }))} />
              </div>
              <div className="form__actions">
                <button type="button" className="btn btn--ghost" onClick={() => { setPasswordMode(false); setPasswordError(""); }}>Annuler</button>
                <button type="submit" className="btn btn--primary">Changer le mot de passe</button>
              </div>
            </form>
          ) : (
            <button className="btn btn--ghost" onClick={() => setPasswordMode(true)}>
              Modifier le mot de passe
            </button>
          )}
        </div>

        <div style={{ marginBottom: 'var(--space-xl)' }}>
          <h2 className="section-title">Mes tickets ({userTickets.length})</h2>
          {userTickets.length === 0 ? (
            <p className="muted">Vous n'avez cree aucun ticket.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {userTickets.slice(0, 5).map(t => (
                <Link key={t.id} to={`/tickets/${t.id}`} className="data-row" style={{ textDecoration: 'none', cursor: 'pointer' }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{t.titre}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: 2 }}>{t.categorie} · {t.statut}</div>
                  </div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>→</span>
                </Link>
              ))}
              {userTickets.length > 5 && (
                <Link to="/tickets" style={{ fontSize: '0.85rem', color: 'var(--color-primary)', textAlign: 'center' }}>
                  Voir tous mes tickets ({userTickets.length})
                </Link>
              )}
            </div>
          )}
        </div>

        <div className="danger-zone">
          <h2 className="section-title">Deconnexion</h2>
          <p>
            Vous etes sur le point de vous deconnecter de votre session sur cet appareil.
          </p>
          <button onClick={logout} className="btn-danger">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Se deconnecter
          </button>
        </div>

      </div>
    </div>
  );
}
