import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import ticketService from "../../api/ticketService";
import Badge from "../../components/Badge";
import { getStatut, getPriorite } from "../../constants/ticketEnums";
import "../../styles/form.css";
import "../../styles/tickets.css";
import "../../styles/detail.css";

const DEMO_MODE = true;

const TICKETS_DEMO = [
  { id: 1, titre: "Imprimante du 2e étage hors service", categorie: "Matériel", priorite: "haute", statut: "nouveau", date_creation: "2026-06-18", auteur: "Awa Ndiaye", description: "L'imprimante du 2e étage ne répond plus depuis ce matin. Un voyant rouge clignote et aucune impression ne sort. Plusieurs collègues sont bloqués." },
  { id: 2, titre: "Connexion Wi-Fi instable en salle B", categorie: "Réseau", priorite: "urgente", statut: "en_cours", date_creation: "2026-06-17", auteur: "Cheikh Fall", description: "Le Wi-Fi de la salle B coupe toutes les 5 minutes. Impossible de suivre les cours en ligne correctement." },
  { id: 3, titre: "Installer la licence Office sur le PC 12", categorie: "Logiciel", priorite: "basse", statut: "assigne", date_creation: "2026-06-16", auteur: "Mariama Sow", description: "Le poste 12 n'a pas la suite Office installée. Merci de l'installer avant la fin de la semaine." },
  { id: 4, titre: "Mot de passe de messagerie oublié", categorie: "Messagerie", priorite: "moyenne", statut: "resolu", date_creation: "2026-06-15", auteur: "Ibrahima Ba", description: "J'ai oublié le mot de passe de ma messagerie professionnelle et je n'arrive plus à me connecter." },
  { id: 5, titre: "Demande d'accès au dossier partagé RH", categorie: "Accès / Comptes", priorite: "moyenne", statut: "ferme", date_creation: "2026-06-12", auteur: "Fatou Diallo", description: "Je dois accéder au dossier partagé du service RH pour traiter les contrats. Merci de m'ajouter les droits." },
  { id: 6, titre: "Écran qui clignote sur le poste 8", categorie: "Matériel", priorite: "haute", statut: "nouveau", date_creation: "2026-06-19", auteur: "Ousmane Diop", description: "L'écran du poste 8 clignote en permanence, c'est difficilement utilisable. Peut-être un câble à changer." },
];

const COMMENTAIRES_DEMO = [
  { id: 1, auteur: "Awa Ndiaye", contenu: "L'imprimante affiche un code erreur E045.", date: "2026-06-18" },
  { id: 2, auteur: "Technicien Diop", contenu: "Je passe vérifier le tambour cet après-midi.", date: "2026-06-19" },
];

function TicketDetail() {
  const { id } = useParams();

  const [ticket, setTicket] = useState(null);
  const [commentaires, setCommentaires] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [nouveauComm, setNouveauComm] = useState("");
  const [envoiComm, setEnvoiComm] = useState(false);

  useEffect(() => {
    if (DEMO_MODE) {
      const t = TICKETS_DEMO.find((x) => String(x.id) === String(id));
      setTicket(t || null);
      setCommentaires(COMMENTAIRES_DEMO);
      setChargement(false);
      return;
    }
    Promise.all([ticketService.detail(id), ticketService.listerCommentaires(id)])
      .then(([resTicket, resComm]) => {
        setTicket(resTicket.data);
        setCommentaires(resComm.data);
      })
      .catch(() => setTicket(null))
      .finally(() => setChargement(false));
  }, [id]);

  const ajouterCommentaire = async (e) => {
    e.preventDefault();
    if (!nouveauComm.trim()) return;

    if (DEMO_MODE) {
      const c = {
        id: Date.now(),
        auteur: "Moi",
        contenu: nouveauComm.trim(),
        date: new Date().toISOString().slice(0, 10),
      };
      setCommentaires((prev) => [...prev, c]);
      setNouveauComm("");
      return;
    }

    try {
      setEnvoiComm(true);
      await ticketService.ajouterCommentaire(id, nouveauComm.trim());
      const res = await ticketService.listerCommentaires(id);
      setCommentaires(res.data);
      setNouveauComm("");
    } finally {
      setEnvoiComm(false);
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
        <Link to="/tickets" className="btn btn--ghost">
          ← Retour à la liste
        </Link>
      </div>
    );
  }

  const statut = getStatut(ticket.statut);
  const priorite = getPriorite(ticket.priorite);

  return (
    <div className="page">
      <Link to="/tickets" className="back-link">
        ← Retour à la liste
      </Link>

      <div className="card">
        <div className="detail-head">
          <h1 className="page__title">{ticket.titre}</h1>
          <div className="detail-badges">
            <Badge label={priorite.label} color={priorite.color} />
            <Badge label={statut.label} color={statut.color} />
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
          Commentaires ({commentaires.length})
        </h2>

        {commentaires.length === 0 ? (
          <p className="muted">Aucun commentaire pour le moment.</p>
        ) : (
          <ul className="comment-list">
            {commentaires.map((c) => (
              <li key={c.id} className="comment">
                <div className="comment__head">
                  <span className="comment__author">{c.auteur}</span>
                  <span className="comment__date">{formaterDate(c.date)}</span>
                </div>
                <p className="comment__body">{c.contenu}</p>
              </li>
            ))}
          </ul>
        )}

        <form onSubmit={ajouterCommentaire} className="comment-form" noValidate>
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
            />
          </div>
          <div className="form__actions">
            <button
              type="submit"
              className="btn btn--primary"
              disabled={envoiComm || !nouveauComm.trim()}
            >
              {envoiComm ? "Envoi..." : "Publier"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function formaterDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
}

export default TicketDetail;