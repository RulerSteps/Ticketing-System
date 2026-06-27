import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import * as ticketService from "../services/ticketService";
import "../styles/form.css";

const CATEGORIES = [
  { value: "Matériel", icon: "🖥️", desc: "PC, imprimante, ecran..." },
  { value: "Réseau", icon: "📡", desc: "Wi-Fi, connexion, VPN..." },
  { value: "Logiciel", icon: "💿", desc: "Application, licence, installation..." },
  { value: "Messagerie", icon: "📧", desc: "Email, Outlook, Teams..." },
  { value: "Accès / Comptes", icon: "🔐", desc: "Mot de passe, droits, compte..." },
];

const STEPS = ["Categorie", "Details"];

export default function NewTicketPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    titre: "",
    description: "",
    categorie: "",
    fichier_joint: null,
  });
  const [fichierNom, setFichierNom] = useState("");

  const canNext = () => {
    if (step === 0) return formData.categorie !== "";
    if (step === 1) return formData.titre.trim() !== "" && formData.description.trim() !== "";
    return false;
  };

  const handleSubmit = async () => {
    if (!canNext()) return;
    const authorName = user ? `${user.prenom || ''} ${user.nom || ''}`.trim() : "Utilisateur";
    await ticketService.createTicket({
      ...formData,
      fichier_joint: formData.fichier_joint ? { name: formData.fichier_joint.name, size: formData.fichier_joint.size } : null,
    }, authorName);
    navigate("/tickets");
  };

  return (
    <div className="page" style={{ maxWidth: "680px", margin: "0 auto" }}>
      <div style={{ marginBottom: "32px" }}>
        <button
          onClick={() => step === 0 ? navigate(-1) : setStep(s => s - 1)}
          style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-text-muted)", fontSize: "0.9rem", padding: 0, display: "flex", alignItems: "center", gap: "6px", marginBottom: "16px" }}
        >
          ← {step === 0 ? "Retour" : "Etape precedente"}
        </button>
        <h1 className="page__title" style={{ margin: 0 }}>Nouveau ticket</h1>
        <p style={{ color: "var(--color-text-muted)", margin: "8px 0 0", fontSize: "0.95rem" }}>
          Decrivez votre probleme en quelques etapes simples.
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

      {/* Step 0 — Categorie */}
      {step === 0 && (
        <div className="card" style={{ padding: "var(--space-xl)" }}>
          <h2 style={{ margin: "0 0 8px", fontSize: "1.15rem", fontWeight: 700 }}>Quelle est la categorie du probleme ?</h2>
          <p style={{ color: "var(--color-text-muted)", fontSize: "0.9rem", marginTop: 0, marginBottom: "24px" }}>Choisissez la categorie qui correspond le mieux a votre incident.</p>
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

      {/* Step 1 — Details */}
      {step === 1 && (
        <div className="card" style={{ padding: "var(--space-xl)" }}>
          <h2 style={{ margin: "0 0 8px", fontSize: "1.15rem", fontWeight: 700 }}>Decrivez votre probleme</h2>
          <p style={{ color: "var(--color-text-muted)", fontSize: "0.9rem", marginTop: 0, marginBottom: "24px" }}>Plus vous etes precis, plus le technicien pourra vous aider rapidement.</p>

          {formData.categorie && (
            <div style={{ display: "flex", gap: "8px", marginBottom: "24px", flexWrap: "wrap" }}>
              <span style={{ background: "var(--color-primary-soft)", color: "var(--color-primary)", borderRadius: "20px", padding: "4px 12px", fontSize: "0.82rem", fontWeight: 600 }}>
                {CATEGORIES.find(c => c.value === formData.categorie)?.icon} {formData.categorie}
              </span>
            </div>
          )}

          <div className="field">
            <label className="field__label" htmlFor="titre">Titre court et clair <span style={{ color: "var(--color-danger)" }}>*</span></label>
            <input
              type="text"
              id="titre"
              className="input"
              placeholder="Ex: Imprimante bloquee au 3eme etage"
              value={formData.titre}
              onChange={e => setFormData(p => ({ ...p, titre: e.target.value }))}
              maxLength={80}
            />
            <span style={{ fontSize: "0.78rem", color: "var(--color-text-muted)", textAlign: "right" }}>{formData.titre.length}/80</span>
          </div>

          <div className="field" style={{ marginBottom: 0 }}>
            <label className="field__label" htmlFor="description">Description detaillee <span style={{ color: "var(--color-danger)" }}>*</span></label>
            <textarea
              id="description"
              className="textarea"
              rows={5}
              placeholder="Depuis quand ? Que s'est-il passe exactement ? Quels sont les messages d'erreur ?"
              value={formData.description}
              onChange={e => setFormData(p => ({ ...p, description: e.target.value }))}
            />
          </div>

          <div className="field">
            <label className="field__label" htmlFor="fichier">Piece jointe (optionnelle)</label>
            <input
              type="file"
              id="fichier"
              className="input"
              onChange={e => {
                const file = e.target.files[0];
                setFormData(p => ({ ...p, fichier_joint: file }));
                setFichierNom(file ? file.name : "");
              }}
            />
            {fichierNom && (
              <span style={{ fontSize: "0.82rem", color: "var(--color-text-muted)" }}>
                Fichier selectionne : {fichierNom}
              </span>
            )}
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
          {step === 0 ? "Annuler" : "← Precedent"}
        </button>

        {step < 1 ? (
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
