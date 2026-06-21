import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ticketService from "../../api/ticketService";
import Badge from "../../components/Badge";
import { STATUTS, PRIORITES, getStatut, getPriorite } from "../../constants/ticketEnums";
import "../../styles/tickets.css";

const DEMO_MODE = true;

const CATEGORIES_DEMO = ["Matériel", "Réseau", "Logiciel", "Messagerie", "Accès / Comptes"];

const TICKETS_DEMO = [
  { id: 1, titre: "Imprimante du 2e étage hors service", categorie: "Matériel", priorite: "haute", statut: "nouveau", date_creation: "2026-06-18" },
  { id: 2, titre: "Connexion Wi-Fi instable en salle B", categorie: "Réseau", priorite: "urgente", statut: "en_cours", date_creation: "2026-06-17" },
  { id: 3, titre: "Installer la licence Office sur le PC 12", categorie: "Logiciel", priorite: "basse", statut: "assigne", date_creation: "2026-06-16" },
  { id: 4, titre: "Mot de passe de messagerie oublié", categorie: "Messagerie", priorite: "moyenne", statut: "resolu", date_creation: "2026-06-15" },
  { id: 5, titre: "Demande d'accès au dossier partagé RH", categorie: "Accès / Comptes", priorite: "moyenne", statut: "ferme", date_creation: "2026-06-12" },
  { id: 6, titre: "Écran qui clignote sur le poste 8", categorie: "Matériel", priorite: "haute", statut: "nouveau", date_creation: "2026-06-19" },
];

function TicketList() {
  const [tickets, setTickets] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [filtres, setFiltres] = useState({
    recherche: "",
    statut: "",
    priorite: "",
    categorie: "",
  });

  useEffect(() => {
    if (DEMO_MODE) {
      setTickets(TICKETS_DEMO);
      setChargement(false);
      return;
    }
    ticketService
      .lister()
      .then((res) => setTickets(res.data))
      .catch(() => setTickets([]))
      .finally(() => setChargement(false));
  }, []);

  const handleFiltre = (e) => {
    const { name, value } = e.target;
    setFiltres((prev) => ({ ...prev, [name]: value }));
  };

  const reinitialiserFiltres = () =>
    setFiltres({ recherche: "", statut: "", priorite: "", categorie: "" });

  const ticketsFiltres = tickets.filter((t) => {
    const okRecherche = t.titre.toLowerCase().includes(filtres.recherche.toLowerCase());
    const okStatut = !filtres.statut || t.statut === filtres.statut;
    const okPriorite = !filtres.priorite || t.priorite === filtres.priorite;
    const okCategorie = !filtres.categorie || t.categorie === filtres.categorie;
    return okRecherche && okStatut && okPriorite && okCategorie;
  });

  return (
    <div className="page page--wide">
      <div className="list-header">
        <h1 className="page__title">Mes tickets</h1>
        <Link to="/tickets/nouveau" className="btn btn--primary">
          + Créer un ticket
        </Link>
      </div>

      <div className="filters">
        <input
          type="text"
          name="recherche"
          className="input"
          placeholder="Rechercher par titre..."
          value={filtres.recherche}
          onChange={handleFiltre}
        />
        <select name="statut" className="select" value={filtres.statut} onChange={handleFiltre}>
          <option value="">Tous les statuts</option>
          {STATUTS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
        <select name="priorite" className="select" value={filtres.priorite} onChange={handleFiltre}>
          <option value="">Toutes les priorités</option>
          {PRIORITES.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label}
            </option>
          ))}
        </select>
        <select name="categorie" className="select" value={filtres.categorie} onChange={handleFiltre}>
          <option value="">Toutes les catégories</option>
          {CATEGORIES_DEMO.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <button className="btn btn--ghost" onClick={reinitialiserFiltres}>
          Réinitialiser
        </button>
      </div>

      {chargement ? (
        <p className="muted">Chargement des tickets...</p>
      ) : ticketsFiltres.length === 0 ? (
        <div className="empty">
          <p>Aucun ticket ne correspond à ta recherche.</p>
        </div>
      ) : (
        <div className="ticket-list">
          {ticketsFiltres.map((t) => {
            const statut = getStatut(t.statut);
            const priorite = getPriorite(t.priorite);
            return (
              <Link to={`/tickets/${t.id}`} key={t.id} className="ticket-card">
                <div className="ticket-card__main">
                  <h3 className="ticket-card__title">{t.titre}</h3>
                  <p className="ticket-card__meta">
                    {t.categorie} · {formaterDate(t.date_creation)}
                  </p>
                </div>
                <div className="ticket-card__badges">
                  <Badge label={priorite.label} color={priorite.color} />
                  <Badge label={statut.label} color={statut.color} />
                </div>
              </Link>
            );
          })}
        </div>
      )}

      <p className="muted count">{ticketsFiltres.length} ticket(s) affiché(s)</p>
    </div>
  );
}

function formaterDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
}

export default TicketList;