import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import "../styles/profile.css";
import "../styles/form.css";

export default function ProfilePage() {
  const { user, logout } = useAuth();

  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    prenom: user?.prenom || "",
    nom: user?.nom || "",
  });
  const [saved, setSaved] = useState(false);

  if (!user) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    // Dans une vraie appli, on enverrait au backend.
    // Ici on met à jour le localStorage pour simuler la persistance.
    const updatedUser = { ...user, prenom: formData.prenom, nom: formData.nom };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setSaved(true);
    setEditMode(false);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleCancel = () => {
    setFormData({ prenom: user?.prenom || "", nom: user?.nom || "" });
    setEditMode(false);
  };

  return (
    <div className="page" style={{ maxWidth: '700px', margin: '0 auto', animation: 'fadeIn 0.3s ease-out' }}>
      <div className="card" style={{ padding: 'var(--space-xl)' }}>

        {/* Header */}
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

        {/* Success banner */}
        {saved && (
          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px', padding: '12px 16px', marginBottom: '24px', color: '#166534', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Profil mis à jour avec succès !
          </div>
        )}

        {/* Informations personnelles */}
        <div style={{ marginBottom: 'var(--space-xl)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-md)' }}>
            <h2 className="section-title" style={{ margin: 0 }}>Informations personnelles</h2>
            {!editMode && (
              <button className="btn btn--ghost" style={{ fontSize: '0.85rem', padding: '6px 14px' }} onClick={() => setEditMode(true)}>
                ✏️ Modifier
              </button>
            )}
          </div>

          {editMode ? (
            <form onSubmit={handleSave} className="comment-form" noValidate>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="field">
                  <label className="field__label" htmlFor="prenom">Prénom</label>
                  <input
                    type="text"
                    id="prenom"
                    name="prenom"
                    className="input"
                    value={formData.prenom}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="field">
                  <label className="field__label" htmlFor="nom">Nom</label>
                  <input
                    type="text"
                    id="nom"
                    name="nom"
                    className="input"
                    value={formData.nom}
                    onChange={handleChange}
                    required
                  />
                </div>
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
                <span className="data-label">Prénom</span>
                <span className="data-value">{formData.prenom || '—'}</span>
              </div>
              <div className="data-row">
                <span className="data-label">Nom</span>
                <span className="data-value">{formData.nom || '—'}</span>
              </div>
              <div className="data-row">
                <span className="data-label">Adresse Email</span>
                <span className="data-value">{user.email}</span>
              </div>
            </div>
          )}
        </div>

        {/* Déconnexion */}
        <div className="danger-zone">
          <h2 className="section-title">Déconnexion</h2>
          <p>
            Vous êtes sur le point de vous déconnecter de votre session sur cet appareil.
          </p>
          <button onClick={logout} className="btn-danger">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Se déconnecter
          </button>
        </div>

      </div>
    </div>
  );
}
