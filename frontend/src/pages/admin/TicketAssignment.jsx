import { useEffect, useState } from 'react';
import AIBadge from '../../components/shared/AIBadge';
import ConfirmModal from '../../components/shared/ConfirmModal';
import { getUnassignedTickets, getTechnicians, assignTicket } from '../../services/ahmaApi';

const STATUS_COLOR = {
  CRITIQUE: 'border-l-red-500',
  HAUTE:    'border-l-orange-500',
  MOYENNE:  'border-l-yellow-500',
  FAIBLE:   'border-l-green-500',
};

const STATUS_BG = {
  CRITIQUE: 'from-red-50 to-orange-50',
  HAUTE:    'from-orange-50 to-amber-50',
  MOYENNE:  'from-yellow-50 to-amber-50',
  FAIBLE:   'from-green-50 to-emerald-50',
};

const TicketAssignment = () => {
  const [tickets, setTickets]           = useState([]);
  const [technicians, setTechnicians]   = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(null);
  const [assignTarget, setAssignTarget]       = useState(null);
  const [selectedTechId, setSelectedTechId]   = useState('');
  const [assigning, setAssigning]             = useState(false);
  const [assignError, setAssignError]         = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true); setError(null);
        const [ticketData, techData] = await Promise.all([getUnassignedTickets(), getTechnicians()]);
        setTickets(ticketData); setTechnicians(techData);
      } catch { setError('Impossible de charger les donnees.'); }
      finally { setLoading(false); }
    };
    fetchAll();
  }, []);

  const openAssign = (t) => { setAssignTarget(t); setSelectedTechId(''); setAssignError(null); };
  const handlePrepare = (e) => {
    e.preventDefault();
    if (!selectedTechId) { setAssignError('Selectionnez un technicien.'); return; }
    setShowConfirm(true);
  };

  const handleConfirm = async () => {
    if (!assignTarget || !selectedTechId) return;
    try {
      setAssigning(true); setShowConfirm(false);
      await assignTicket(assignTarget.id, Number(selectedTechId));
      setTickets((prev) => prev.filter((t) => t.id !== assignTarget.id));
      setAssignTarget(null);
    } catch (err) { setAssignError(err.response?.data?.message || 'Erreur.'); }
    finally { setAssigning(false); }
  };

  const selectedTech = technicians.find((t) => String(t.id) === String(selectedTechId));

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-fuchsia-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-500 rounded-2xl px-8 py-6 mb-8 shadow-xl shadow-violet-200/50 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-20 translate-x-20" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-16 -translate-x-16" />
          <div>
            <h1 className="text-white text-xl font-bold">Assignation des tickets</h1>
            <p className="text-white/60 text-sm mt-1">{tickets.length} ticket(s) en attente d'assignation</p>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 rounded-xl px-5 py-3.5 text-sm mb-6 shadow-md shadow-red-100">{error}</div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <div className="bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl shadow-lg shadow-violet-100 p-5 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-white/5 rounded-full -translate-y-8 translate-x-8" />
            <p className="text-xs font-medium text-white/70 uppercase tracking-wider">En attente</p>
            <p className="text-2xl font-bold mt-1">{tickets.length}</p>
          </div>
          <div className="bg-gradient-to-br from-rose-500 to-pink-600 rounded-xl shadow-lg shadow-rose-100 p-5 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-white/5 rounded-full -translate-y-8 translate-x-8" />
            <p className="text-xs font-medium text-white/70 uppercase tracking-wider">Critiques</p>
            <p className="text-2xl font-bold mt-1">{tickets.filter((t) => t.aiLevel === 'CRITIQUE').length}</p>
          </div>
          <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl shadow-lg shadow-amber-100 p-5 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-white/5 rounded-full -translate-y-8 translate-x-8" />
            <p className="text-xs font-medium text-white/70 uppercase tracking-wider">Haute priorite</p>
            <p className="text-2xl font-bold mt-1">{tickets.filter((t) => t.aiLevel === 'HAUTE').length}</p>
          </div>
          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl shadow-lg shadow-emerald-100 p-5 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-white/5 rounded-full -translate-y-8 translate-x-8" />
            <p className="text-xs font-medium text-white/70 uppercase tracking-wider">Techniciens dispo</p>
            <p className="text-2xl font-bold mt-1">{technicians.length}</p>
          </div>
        </div>

        {/* Liste */}
        {loading ? (
          <div className="flex justify-center py-24">
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-violet-400 font-medium">Chargement des tickets...</p>
            </div>
          </div>
        ) : tickets.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-violet-100 shadow-xl shadow-violet-100/30 p-16 text-center">
            <p className="text-gray-500 text-sm font-semibold">Tous les tickets sont assignes</p>
            <p className="text-gray-400 text-xs mt-1">Aucun ticket en attente pour le moment.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {tickets.map((ticket) => (
              <div key={ticket.id}
                className={`bg-white/80 backdrop-blur-sm rounded-2xl border border-violet-100 shadow-lg shadow-violet-100/30 hover:shadow-xl hover:shadow-violet-100/50 transition-all duration-200 border-l-4 ${STATUS_COLOR[ticket.aiLevel] ?? 'border-l-gray-300'} bg-gradient-to-r ${STATUS_BG[ticket.aiLevel] ?? 'from-gray-50 to-white'}`}>
                <div className="p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-3 flex-wrap mb-2">
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white flex items-center justify-center font-bold text-xs shadow-md flex-shrink-0">
                        #{ticket.id}
                      </div>
                      <h3 className="font-bold text-gray-800 text-sm mt-1">{ticket.title}</h3>
                      {ticket.aiScore !== undefined && <AIBadge score={ticket.aiScore} level={ticket.aiLevel} />}
                    </div>
                    <div className="flex items-center gap-2.5 text-xs text-gray-400 ml-11 flex-wrap">
                      <span className="font-medium text-violet-500">{ticket.category?.name ?? ticket.categoryName ?? 'Non classe'}</span>
                      <span className="w-1 h-1 rounded-full bg-violet-200" />
                      <span>{ticket.createdAt ? new Date(ticket.createdAt).toLocaleDateString('fr-FR') : '—'}</span>
                      {ticket.description && (
                        <>
                          <span className="w-1 h-1 rounded-full bg-violet-200" />
                          <span className="truncate max-w-48 text-gray-400">{ticket.description.substring(0, 80)}...</span>
                        </>
                      )}
                    </div>
                  </div>
                  <button onClick={() => openAssign(ticket)}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white px-5 py-2.5 rounded-xl hover:from-violet-700 hover:to-fuchsia-700 transition-all text-sm font-bold flex-shrink-0 shadow-lg shadow-violet-200">
                    Assigner
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal assignation */}
        {assignTarget && !showConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setAssignTarget(null)}>
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md mx-4 border border-violet-50" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center gap-4 mb-6 pb-5 border-b border-violet-50">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white flex items-center justify-center font-bold text-lg shadow-lg shadow-violet-200">
                  #{assignTarget.id}
                </div>
                <div className="min-w-0">
                  <h2 className="text-lg font-bold text-gray-900">Assigner le ticket</h2>
                  <p className="text-xs text-gray-400 mt-0.5 truncate">#{assignTarget.id} — {assignTarget.title}</p>
                </div>
              </div>

              {assignTarget.aiScore !== undefined && (
                <div className="mb-5 flex items-center gap-3 bg-gradient-to-r from-violet-50 to-fuchsia-50 rounded-xl px-4 py-3">
                  <span className="text-xs font-semibold text-gray-600">Priorite IA :</span>
                  <AIBadge score={assignTarget.aiScore} level={assignTarget.aiLevel} />
                </div>
              )}

              {assignError && <div className="bg-red-50 border-l-4 border-red-500 text-red-700 rounded-xl px-4 py-3 text-sm mb-5">{assignError}</div>}

              <form onSubmit={handlePrepare} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Technicien</label>
                  <select value={selectedTechId} onChange={(e) => setSelectedTechId(e.target.value)}
                    className="w-full bg-violet-50/50 border border-violet-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400/40 focus:border-violet-300 transition-all" required>
                    <option value="">— Choisir un technicien —</option>
                    {technicians.map((tech) => (
                      <option key={tech.id} value={tech.id}>{tech.name} {tech.email ? `(${tech.email})` : ''}</option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setAssignTarget(null)}
                    className="flex-1 px-5 py-3 border border-violet-100 rounded-xl text-sm text-violet-600 hover:bg-violet-50 transition-all font-semibold">Annuler</button>
                  <button type="submit" disabled={assigning}
                    className="flex-1 px-5 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-xl hover:from-violet-700 hover:to-fuchsia-700 transition-all text-sm font-bold disabled:opacity-50 shadow-lg shadow-violet-200">
                    Continuer
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <ConfirmModal isOpen={showConfirm}
          message={`Assigner le ticket #${assignTarget?.id} a ${selectedTech?.name ?? 'ce technicien'} ?`}
          onConfirm={handleConfirm} onCancel={() => setShowConfirm(false)} />
      </div>
    </div>
  );
};

export default TicketAssignment;
