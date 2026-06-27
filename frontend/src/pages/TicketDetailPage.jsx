import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import * as ticketService from "../services/ticketService";
import Badge from "../components/common/Badge";
import { STATUTS, PRIORITES, getPriorite } from "../constants/ticketEnums";
import { useAuth } from "../context/AuthContext";
import "../styles/form.css";
import "../styles/tickets.css";
import "../styles/detail.css";

const CATEGORIES = ["Matériel", "Réseau", "Logiciel", "Messagerie", "Accès / Comptes"];

export default function TicketDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [ticket, setTicket] = useState(null);
  const [chargement, setChargement] = useState(true);
  const [nouveauComm, setNouveauComm] = useState("");
  const [commFichier, setCommFichier] = useState(null);
  const [commFichierNom, setCommFichierNom] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState({ titre: "", description: "", categorie: "", priorite: "" });

  const isAuthor = user && ticket && ticket.auteur === user.nom;
  const canChangeStatus = user && (user.role === 'technicien' || user.role === 'administrateur' || user.role?.nom === 'technicien' || user.role?.nom === 'administrateur');

  useEffect(() => {
    const load = async () => {
      setChargement(true);
      const t = await ticketService.getTicketById(id);
      setTicket(t || null);
      setChargement(false);
    };
    load();
  }, [id]);

  const startEditing = () => {
    if (!ticket) return;
    setEditForm({
      titre: ticket.titre,
      description: ticket.description,
      categorie: ticket.categorie,
      priorite: ticket.priorite,
    });
    setEditMode(true);
  };

  const cancelEditing = () => {
    setEditMode(false);
  };

  const saveEditing = async () => {
    if (!editForm.titre.trim() || !editForm.description.trim()) return;
    const authorName = user ? `${user.prenom || ''} ${user.nom || ''}`.trim() : "Utilisateur";
    const updated = await ticketService.updateTicket(id, editForm, authorName);
    if (updated) {
      setTicket({ ...updated });
      setEditMode(false);
    }
  };

  const ajouterCommentaire = async (e) => {
    e.preventDefault();
    if (!nouveauComm.trim()) return;

    const pieceJointe = commFichier ? { name: commFichier.name, size: commFichier.size } : null;
    const authorName = user ? `${user.prenom || ''} ${user.nom || ''}`.trim() : "Malick";
    const updatedTicket = await ticketService.addTicketComment(id, nouveauComm.trim(), authorName, pieceJointe);
    if (updatedTicket) {
      setTicket({ ...updatedTicket });
      setNouveauComm("");
      setCommFichier(null);
      setCommFichierNom("");
    }
  };

  const handleStatutChange = async (e) => {
    const newStatus = e.target.value;
    const authorName = user ? `${user.prenom || ''} ${user.nom || ''}`.trim() : "Malick";
    const updatedTicket = await ticketService.updateTicketStatus(id, newStatus, authorName);
    if (updatedTicket) {
      setTicket({ ...updatedTicket });
    }
  };

  if (chargement) {
    return (
      <div className="page">
        <p className="muted">Chargement...</p>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="page">
        <p>Ticket introuvable.</p>
        <button onClick={() => navigate(-1)} className="btn btn--ghost">
          ← Retour
        </button>
      </div>
    );
  }

  const prioriteObj = getPriorite(ticket.priorite);

  const formaterDate = (iso) => {
    if (!iso) return "";
    const d = new Date(iso);
    return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric", hour: '2-digit', minute:'2-digit' });
  };

  return (
    <div className="page">
      <button onClick={() => navigate(-1)} className="back-link" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, font: 'inherit' }}>
        ← Retour
      </button>

      <div className="card">
        <div className="detail-head" style={{ flexWrap: 'wrap', gap: '16px' }}>
          <h1 className="page__title" style={{ margin: 0 }}>{ticket.titre}</h1>
          <div className="detail-badges" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Badge label={prioriteObj.label} color={prioriteObj.color} />
            {ticket.statut === 'nouveau' && isAuthor && !editMode && (
              <button className="btn btn--ghost" style={{ fontSize: '0.8rem', padding: '4px 10px' }} onClick={startEditing}>
                Modifier
              </button>
            )}
            {canChangeStatus && (
              <div className="status-selector" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: '12px' }}>
                <span style={{ fontSize: '14px', color: 'var(--color-text-muted)' }}>Changer :</span>
                <select 
                  className="select" 
                  value={ticket.statut} 
                  onChange={handleStatutChange}
                  style={{ padding: '4px 8px', fontSize: '13px', width: 'auto' }}
                >
                  {STATUTS.map(s => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        <dl className="detail-meta">
          <div>
            <dt>Categorie</dt>
            <dd>{ticket.categorie}</dd>
          </div>
          <div>
            <dt>Cree par</dt>
            <dd>{ticket.auteur}</dd>
          </div>
          <div>
            <dt>Date</dt>
            <dd>{formaterDate(ticket.date_creation)}</dd>
          </div>
        </dl>

        <div className="detail-section">
          <h2 className="detail-section__title">Description</h2>
          {editMode ? (
            <div>
              <div className="field">
                <label className="field__label" htmlFor="edit-titre">Titre</label>
                <input id="edit-titre" className="input" value={editForm.titre} onChange={e => setEditForm(p => ({ ...p, titre: e.target.value }))} />
              </div>
              <div className="field">
                <label className="field__label" htmlFor="edit-cat">Categorie</label>
                <select id="edit-cat" className="select" value={editForm.categorie} onChange={e => setEditForm(p => ({ ...p, categorie: e.target.value }))}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="field">
                <label className="field__label" htmlFor="edit-prio">Priorite</label>
                <select id="edit-prio" className="select" value={editForm.priorite} onChange={e => setEditForm(p => ({ ...p, priorite: e.target.value }))}>
                  {PRIORITES.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                </select>
              </div>
              <div className="field">
                <label className="field__label" htmlFor="edit-desc">Description</label>
                <textarea id="edit-desc" className="textarea" rows={4} value={editForm.description} onChange={e => setEditForm(p => ({ ...p, description: e.target.value }))} />
              </div>
              <div className="form__actions">
                <button className="btn btn--ghost" onClick={cancelEditing}>Annuler</button>
                <button className="btn btn--primary" onClick={saveEditing} disabled={!editForm.titre.trim() || !editForm.description.trim()}>
                  Enregistrer
                </button>
              </div>
            </div>
          ) : (
            <p className="detail-description">{ticket.description}</p>
          )}
        </div>

        {ticket.fichier_joint && !editMode && (
          <div className="detail-section" style={{ marginTop: 'var(--space-md)' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: 'middle', marginRight: 4 }}>
                <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
              </svg>
              {ticket.fichier_joint.name}
            </span>
          </div>
        )}

        {ticket.statut !== 'nouveau' && (
          <div style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', marginTop: 'var(--space-sm)' }}>
            {ticket.statut === 'assigne' && 'Ticket assigne — en attente de traitement'}
            {ticket.statut === 'en_cours' && 'Ticket en cours de traitement'}
            {ticket.statut === 'en_attente' && 'En attente d\'une action externe'}
            {ticket.statut === 'resolu' && 'Ticket resolu — peut etre ferme'}
            {ticket.statut === 'ferme' && 'Ticket ferme — plus d\'actions possibles'}
          </div>
        )}
      </div>

      <div className="card" style={{ marginTop: "var(--space-lg)" }}>
        <h2 className="detail-section__title">
          Historique et Commentaires ({ticket.history ? ticket.history.length : 0})
        </h2>

        {!ticket.history || ticket.history.length === 0 ? (
          <p className="muted">Aucun historique pour le moment.</p>
        ) : (
          <ul className="comment-list" style={{ listStyle: 'none', padding: 0 }}>
            {ticket.history.map((h) => (
              <li key={h.id} className="comment" style={{ 
                borderLeft: h.type === 'system' ? '3px solid var(--color-border)' : '3px solid var(--color-primary)',
                backgroundColor: h.type === 'system' ? '#fafafa' : '#fff',
                marginLeft: h.type === 'system' ? '1rem' : '0'
              }}>
                <div className="comment__head">
                  <span className="comment__author">{h.author}</span>
                  <span className="comment__date">{formaterDate(h.date)}</span>
                </div>
                <div className="comment__body">
                  {h.type === 'system' ? (
                    <em style={{ color: 'var(--color-text-muted)' }}>{h.action}</em>
                  ) : (
                    <div>
                      <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{h.content}</p>
                      {h.piece_jointe && (
                        <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 6 }}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                          </svg>
                          {h.piece_jointe.name}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}

        <form onSubmit={ajouterCommentaire} className="comment-form" noValidate style={{ marginTop: '24px' }}>
          <div className="field">
            <label className="field__label" htmlFor="commentaire">
              Ajouter un commentaire
            </label>
            <textarea
              id="commentaire"
              className="textarea"
              placeholder="Ecris ton commentaire..."
              value={nouveauComm}
              onChange={(e) => setNouveauComm(e.target.value)}
              rows={3}
            />
          </div>
          <div className="field">
            <label className="field__label" htmlFor="comm-fichier">Piece jointe (optionnelle)</label>
            <input
              type="file"
              id="comm-fichier"
              className="input"
              onChange={e => {
                const file = e.target.files[0];
                setCommFichier(file);
                setCommFichierNom(file ? file.name : "");
              }}
            />
            {commFichierNom && (
              <span style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
                Fichier : {commFichierNom}
              </span>
            )}
          </div>
          <div className="form__actions">
            <button
              type="submit"
              className="btn btn--primary"
              disabled={!nouveauComm.trim()}
            >
              Publier
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
