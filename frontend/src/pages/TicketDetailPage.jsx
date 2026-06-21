import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getTicketById, updateTicketStatus, addTicketComment } from "../data/mockTickets";
import Badge from "../components/common/Badge";
import { STATUTS, getStatut, getPriorite } from "../constants/ticketEnums";
import "../styles/form.css";
import "../styles/tickets.css";
import "../styles/detail.css";

export default function TicketDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [ticket, setTicket] = useState(null);
  const [chargement, setChargement] = useState(true);
  const [nouveauComm, setNouveauComm] = useState("");

  useEffect(() => {
    const t = getTicketById(id);
    if (t) {
      setTicket(t);
    }
    setChargement(false);
  }, [id]);

  const ajouterCommentaire = (e) => {
    e.preventDefault();
    if (!nouveauComm.trim()) return;

    const updatedTicket = addTicketComment(id, nouveauComm.trim());
    if (updatedTicket) {
      setTicket({ ...updatedTicket });
      setNouveauComm("");
    }
  };

  const handleStatutChange = (e) => {
    const newStatus = e.target.value;
    const updatedTicket = updateTicketStatus(id, newStatus);
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

  const statutObj = getStatut(ticket.statut);
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
          </div>
        </div>

        <dl className="detail-meta">
          <div>
            <dt>Catégorie</dt>
            <dd>{ticket.categorie}</dd>
          </div>
          <div>
            <dt>Créé par</dt>
            <dd>{ticket.auteur}</dd>
          </div>
          <div>
            <dt>Date</dt>
            <dd>{formaterDate(ticket.date_creation)}</dd>
          </div>
        </dl>

        <div className="detail-section">
          <h2 className="detail-section__title">Description</h2>
          <p className="detail-description">{ticket.description}</p>
        </div>
      </div>

      <div className="card" style={{ marginTop: "var(--space-lg)" }}>
        <h2 className="detail-section__title">
          Historique et Commentaires ({ticket.history.length})
        </h2>

        {ticket.history.length === 0 ? (
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
                    <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{h.content}</p>
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
              placeholder="Écris ton commentaire..."
              value={nouveauComm}
              onChange={(e) => setNouveauComm(e.target.value)}
              rows={3}
            />
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
