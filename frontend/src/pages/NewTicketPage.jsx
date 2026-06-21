import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { createTicket } from "../data/mockTickets";
import "../styles/form.css";

const CATEGORIES = [
  { value: "Matériel", icon: "🖥️", desc: "PC, imprimante, écran..." },
  { value: "Réseau", icon: "📡", desc: "Wi-Fi, connexion, VPN..." },
  { value: "Logiciel", icon: "💿", desc: "Application, licence, installation..." },
  { value: "Messagerie", icon: "📧", desc: "Email, Outlook, Teams..." },
  { value: "Accès / Comptes", icon: "🔐", desc: "Mot de passe, droits, compte..." },
];

const PRIORITES = [
  { value: "basse", label: "Basse", color: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0", desc: "Peut attendre quelques jours" },
  { value: "moyenne", label: "Moyenne", color: "#2563eb", bg: "#eff6ff", border: "#bfdbfe", desc: "À traiter cette semaine" },
  { value: "haute", label: "Haute", color: "#d97706", bg: "#fffbeb", border: "#fde68a", desc: "Bloque mon travail" },
  { value: "urgente", label: "Urgente", color: "#dc2626", bg: "#fef2f2", border: "#fecaca", desc: "Critique, besoin immédiat" },
];

const STEPS = ["Catégorie", "Priorité", "Détails"];

export default function NewTicketPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    titre: "",
    description: "",
    categorie: "",
    priorite: "",
  });

  const canNext = () => {
    if (step === 0) return formData.categorie !== "";
    if (step === 1) return formData.priorite !== "";
    if (step === 2) return formData.titre.trim() !== "" && formData.description.trim() !== "";
    return false;
  };

  const handleSubmit = () => {
    if (!canNext()) return;
    const authorName = user ? `${user.prenom || ''} ${user.nom || ''}`.trim() : "Utilisateur";
    createTicket(formData, authorName);
    navigate("/tickets");
  };

  return (
    <div className="page" style={{ maxWidth: "680px", margin: "0 auto" }}>

      {/* Header */}
      <div style={{ marginBottom: "32px" }}>
        <button
          onClick={() => step === 0 ? navigate(-1) : setStep(s => s - 1)}
          style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-text-muted)", fontSize: "0.9rem", padding: 0, display: "flex", alignItems: "center", gap: "6px", marginBottom: "16px" }}
        >
          ← {step === 0 ? "Retour" : "Étape précédente"}
        </button>
        <h1 className="page__title" style={{ margin: 0 }}>Nouveau ticket</h1>
        <p style={{ color: "var(--color-text-muted)", margin: "8px 0 0", fontSize: "0.95rem" }}>
          Décrivez votre problème en quelques étapes simples.
        </p>
      </div>

      {/* Progress bar */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "32px" }}>
        {STEPS.map((s, i) => (
          <div key={s} style={{ flex: 1 }}>
            <div style={{
              height: "4px",
              borderRadius: "4px",
              background: i <= step ? "var(--color-primary)" : "var(--color-border)",
              transition: "background 0.3s ease"
            }} />
            <p style={{
              fontSize: "0.78rem",
              marginTop: "6px",
              fontWeight: i === step ? 600 : 400,
              color: i === step ? "var(--color-primary)" : i < step ? "var(--color-text-muted)" : "var(--color-border)"
            }}>
              {i + 1}. {s}
            </p>
          </div>
        ))}
      </div>

      {/* Step 0 — Catégorie */}
      {step === 0 && (
        <div className="card" style={{ padding: "var(--space-xl)" }}>
          <h2 style={{ margin: "0 0 8px", fontSize: "1.15rem", fontWeight: 700 }}>Quelle est la catégorie du problème ?</h2>
          <p style={{ color: "var(--color-text-muted)", fontSize: "0.9rem", marginTop: 0, marginBottom: "24px" }}>Choisissez la catégorie qui correspond le mieux à votre incident.</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {CATEGORIES.map(cat => (
              <button
                key={cat.value}
                type="button"
                onClick={() => setFormData(p => ({ ...p, categorie: cat.value }))}
                style={{
                  display: "flex", alignItems: "center", gap: "16px",
                  padding: "16px 20px", borderRadius: "12px", cursor: "pointer", textAlign: "left",
                  border: `2px solid ${formData.categorie === cat.value ? "var(--color-primary)" : "var(--color-border)"}`,
                  background: formData.categorie === cat.value ? "var(--color-primary-soft)" : "var(--color-surface)",
                  transition: "all 0.2s ease", fontFamily: "inherit"
                }}
              >
                <span style={{ fontSize: "1.8rem", lineHeight: 1 }}>{cat.icon}</span>
                <div>
                  <div style={{ fontWeight: 600, color: "var(--color-text)", fontSize: "0.95rem" }}>{cat.value}</div>
                  <div style={{ color: "var(--color-text-muted)", fontSize: "0.82rem", marginTop: "2px" }}>{cat.desc}</div>
                </div>
                {formData.categorie === cat.value && (
                  <div style={{ marginLeft: "auto" }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 1 — Priorité */}
      {step === 1 && (
        <div className="card" style={{ padding: "var(--space-xl)" }}>
          <h2 style={{ margin: "0 0 8px", fontSize: "1.15rem", fontWeight: 700 }}>Quelle est l'urgence de votre problème ?</h2>
          <p style={{ color: "var(--color-text-muted)", fontSize: "0.9rem", marginTop: 0, marginBottom: "24px" }}>Soyez honnête, cela aide le technicien à prioriser son travail.</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {PRIORITES.map(p => (
              <button
                key={p.value}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, priorite: p.value }))}
                style={{
                  display: "flex", alignItems: "center", gap: "16px",
                  padding: "16px 20px", borderRadius: "12px", cursor: "pointer", textAlign: "left",
                  border: `2px solid ${formData.priorite === p.value ? p.color : "var(--color-border)"}`,
                  background: formData.priorite === p.value ? p.bg : "var(--color-surface)",
                  transition: "all 0.2s ease", fontFamily: "inherit"
                }}
              >
                <div style={{ width: "14px", height: "14px", borderRadius: "50%", background: p.color, flexShrink: 0, boxShadow: `0 0 0 3px ${p.bg}, 0 0 0 4px ${p.border}` }} />
                <div>
                  <div style={{ fontWeight: 600, color: p.color, fontSize: "0.95rem" }}>{p.label}</div>
                  <div style={{ color: "var(--color-text-muted)", fontSize: "0.82rem", marginTop: "2px" }}>{p.desc}</div>
                </div>
                {formData.priorite === p.value && (
                  <div style={{ marginLeft: "auto" }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={p.color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2 — Détails */}
      {step === 2 && (
        <div className="card" style={{ padding: "var(--space-xl)" }}>
          <h2 style={{ margin: "0 0 8px", fontSize: "1.15rem", fontWeight: 700 }}>Décrivez votre problème</h2>
          <p style={{ color: "var(--color-text-muted)", fontSize: "0.9rem", marginTop: 0, marginBottom: "24px" }}>Plus vous êtes précis, plus le technicien pourra vous aider rapidement.</p>

          {/* Summary chips */}
          <div style={{ display: "flex", gap: "8px", marginBottom: "24px", flexWrap: "wrap" }}>
            <span style={{ background: "var(--color-primary-soft)", color: "var(--color-primary)", borderRadius: "20px", padding: "4px 12px", fontSize: "0.82rem", fontWeight: 600 }}>
              {CATEGORIES.find(c => c.value === formData.categorie)?.icon} {formData.categorie}
            </span>
            {(() => {
              const p = PRIORITES.find(p => p.value === formData.priorite);
              return (
                <span style={{ background: p.bg, color: p.color, border: `1px solid ${p.border}`, borderRadius: "20px", padding: "4px 12px", fontSize: "0.82rem", fontWeight: 600 }}>
                  Priorité {p.label}
                </span>
              );
            })()}
          </div>

          <div className="field">
            <label className="field__label" htmlFor="titre">Titre court et clair <span style={{ color: "var(--color-danger)" }}>*</span></label>
            <input
              type="text"
              id="titre"
              className="input"
              placeholder="Ex: Imprimante bloquée au 3ème étage"
              value={formData.titre}
              onChange={e => setFormData(p => ({ ...p, titre: e.target.value }))}
              maxLength={80}
            />
            <span style={{ fontSize: "0.78rem", color: "var(--color-text-muted)", textAlign: "right" }}>{formData.titre.length}/80</span>
          </div>

          <div className="field" style={{ marginBottom: 0 }}>
            <label className="field__label" htmlFor="description">Description détaillée <span style={{ color: "var(--color-danger)" }}>*</span></label>
            <textarea
              id="description"
              className="textarea"
              rows={5}
              placeholder="Depuis quand ? Que s'est-il passé exactement ? Quels sont les messages d'erreur ?"
              value={formData.description}
              onChange={e => setFormData(p => ({ ...p, description: e.target.value }))}
            />
          </div>
        </div>
      )}

      {/* Actions */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "24px" }}>
        <button
          type="button"
          className="btn btn--ghost"
          onClick={() => step === 0 ? navigate(-1) : setStep(s => s - 1)}
        >
          {step === 0 ? "Annuler" : "← Précédent"}
        </button>

        {step < 2 ? (
          <button
            type="button"
            className="btn btn--primary"
            disabled={!canNext()}
            onClick={() => setStep(s => s + 1)}
          >
            Suivant →
          </button>
        ) : (
          <button
            type="button"
            className="btn btn--primary"
            disabled={!canNext()}
            onClick={handleSubmit}
            style={{ gap: "8px" }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Soumettre le ticket
          </button>
        )}
      </div>

    </div>
  );
}
