/**
 * TicketAssignment.jsx — Attribution des tickets aux techniciens (Admin)
 * Fonctionnalités :
 *   - Liste des tickets non assignés avec badge IA (score + niveau)
 *   - Sélection d'un technicien dans un modal
 *   - Confirmation d'assignation via API
 *
 * API :
 *   GET  /api/tickets/unassigned
 *   GET  /api/users/technicians
 *   PUT  /api/tickets/:id/assign
 */

import { useEffect, useState } from 'react';
import AIBadge from '../../components/shared/AIBadge';
import ConfirmModal from '../../components/shared/ConfirmModal';
import {
  getUnassignedTickets,
  getTechnicians,
  assignTicket,
} from '../../services/ahmaApi';

const TicketAssignment = () => {
  // ── État ─────────────────────────────────────────────────────────────────────
  const [tickets, setTickets]           = useState([]);
  const [technicians, setTechnicians]   = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(null);

  // ── Modal d'assignation ──────────────────────────────────────────────────────
  const [assignTarget, setAssignTarget]       = useState(null); // ticket sélectionné
  const [selectedTechId, setSelectedTechId]   = useState('');
  const [assigning, setAssigning]             = useState(false);
  const [assignError, setAssignError]         = useState(null);

  // ── Modal de confirmation ────────────────────────────────────────────────────
  const [showConfirm, setShowConfirm] = useState(false);

  // ── Chargement initial ───────────────────────────────────────────────────────
  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        setError(null);
        const [ticketData, techData] = await Promise.all([
          getUnassignedTickets(),
          getTechnicians(),
        ]);
        setTickets(ticketData);
        setTechnicians(techData);
      } catch {
        setError('Impossible de charger les données. Vérifiez votre connexion.');
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  // ── Ouverture du modal d'assignation ─────────────────────────────────────────
  const openAssignModal = (ticket) => {
    setAssignTarget(ticket);
    setSelectedTechId('');
    setAssignError(null);
  };

  // ── Validation du formulaire → ouvre la confirmation ────────────────────────
  const handlePrepareAssign = (e) => {
    e.preventDefault();
    if (!selectedTechId) {
      setAssignError('Veuillez sélectionner un technicien.');
      return;
    }
    setShowConfirm(true);
  };

  // ── Confirmation → appel API ─────────────────────────────────────────────────
  const handleConfirmAssign = async () => {
    if (!assignTarget || !selectedTechId) return;
    try {
      setAssigning(true);
      setShowConfirm(false);
      await assignTicket(assignTarget.id, Number(selectedTechId));
      // Retirer le ticket de la liste une fois assigné
      setTickets((prev) => prev.filter((t) => t.id !== assignTarget.id));
      setAssignTarget(null);
    } catch (err) {
      setAssignError(err.response?.data?.message || 'Erreur lors de l\'assignation.');
    } finally {
      setAssigning(false);
    }
  };

  // ── Technicien sélectionné (pour affichage dans la confirmation) ─────────────
  const selectedTech = technicians.find((t) => String(t.id) === String(selectedTechId));

  // ── Rendu ────────────────────────────────────────────────────────────────────
  return (
    <div className="p-6 space-y-6">
      {/* En-tête */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Assignation des tickets</h1>
        <p className="text-gray-500 text-sm mt-1">
          {tickets.length} ticket(s) en attente d'assignation
        </p>
      </div>

      {/* Erreur globale */}
      {error && (
        <div className="bg-red-50 border border-red-300 text-red-700 rounded-xl px-4 py-3 text-sm">
          ❌ {error}
        </div>
      )}

      {/* Chargement */}
      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : tickets.length === 0 ? (
        /* Liste vide */
        <div className="bg-white rounded-2xl shadow p-12 text-center">
          <div className="text-5xl mb-4">✅</div>
          <p className="text-gray-600 font-medium">Tous les tickets sont assignés !</p>
          <p className="text-gray-400 text-sm mt-1">Aucun ticket en attente pour le moment.</p>
        </div>
      ) : (
        /* Liste des tickets non assignés */
        <div className="space-y-4">
          {tickets.map((ticket) => (
            <div
              key={ticket.id}
              className="bg-white rounded-2xl shadow p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 hover:shadow-md transition"
            >
              {/* Infos du ticket */}
              <div className="flex-1 space-y-2">
                <div className="flex items-start gap-3 flex-wrap">
                  <h3 className="font-semibold text-gray-800 text-base leading-snug">
                    #{ticket.id} — {ticket.title}
                  </h3>
                  {/* Badge IA */}
                  {ticket.aiScore !== undefined && (
                    <AIBadge score={ticket.aiScore} level={ticket.aiLevel} />
                  )}
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-500 flex-wrap">
                  <span className="inline-flex items-center gap-1">
                    🏷️ {ticket.category?.name ?? ticket.categoryName ?? 'Non classé'}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    📅 {ticket.createdAt
                      ? new Date(ticket.createdAt).toLocaleDateString('fr-FR')
                      : '—'
                    }
                  </span>
                  {ticket.description && (
                    <span className="text-gray-400 truncate max-w-xs">
                      {ticket.description.substring(0, 80)}…
                    </span>
                  )}
                </div>
              </div>

              {/* Bouton Assigner */}
              <button
                onClick={() => openAssignModal(ticket)}
                className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-xl hover:bg-indigo-700 transition font-medium text-sm flex-shrink-0"
              >
                👤 Assigner
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ── Modal d'assignation ── */}
      {assignTarget && !showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setAssignTarget(null)}>
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-gray-800 mb-1">Assigner le ticket</h2>
            <p className="text-gray-500 text-sm mb-5 truncate">
              #{assignTarget.id} — {assignTarget.title}
            </p>

            {/* Badge IA dans le modal */}
            {assignTarget.aiScore !== undefined && (
              <div className="mb-4 flex items-center gap-2">
                <span className="text-xs text-gray-500">Priorité IA :</span>
                <AIBadge score={assignTarget.aiScore} level={assignTarget.aiLevel} />
              </div>
            )}

            {assignError && (
              <div className="bg-red-50 border border-red-300 text-red-700 rounded-xl px-3 py-2.5 text-sm mb-4">
                {assignError}
              </div>
            )}

            <form onSubmit={handlePrepareAssign} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sélectionner un technicien *
                </label>
                <select
                  value={selectedTechId}
                  onChange={(e) => setSelectedTechId(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  required
                >
                  <option value="">— Choisir un technicien —</option>
                  {technicians.map((tech) => (
                    <option key={tech.id} value={tech.id}>
                      {tech.name} {tech.email ? `(${tech.email})` : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setAssignTarget(null)}
                  className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl text-gray-600 hover:bg-gray-50 transition text-sm font-medium"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={assigning}
                  className="flex-1 px-4 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition text-sm font-medium disabled:opacity-50"
                >
                  Continuer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Modal de confirmation finale ── */}
      <ConfirmModal
        isOpen={showConfirm}
        message={`Confirmer l'assignation du ticket "#${assignTarget?.id} — ${assignTarget?.title}" à ${selectedTech?.name ?? 'ce technicien'} ?`}
        onConfirm={handleConfirmAssign}
        onCancel={() => setShowConfirm(false)}
      />
    </div>
  );
};

export default TicketAssignment;
