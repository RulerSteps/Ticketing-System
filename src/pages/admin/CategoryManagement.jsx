/**
 * CategoryManagement.jsx — Gestion des catégories de tickets (Admin)
 * Fonctionnalités :
 *   - Tableau : Nom, Description, Nombre de tickets, Actions
 *   - Ajout de catégorie via modal
 *   - Modification via modal pré-rempli
 *   - Suppression avec modal de confirmation
 *
 * API : GET /api/categories | POST /api/categories
 *       PUT /api/categories/:id | DELETE /api/categories/:id
 */

import { useEffect, useState } from 'react';
import ConfirmModal from '../../components/shared/ConfirmModal';
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../../services/ahmaApi';

const EMPTY_FORM = { name: '', description: '' };

const CategoryManagement = () => {
  // ── État principal ──────────────────────────────────────────────────────────
  const [categories, setCategories] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);

  // ── Modal formulaire ────────────────────────────────────────────────────────
  const [showModal, setShowModal]     = useState(false);
  const [editingCat, setEditingCat]   = useState(null); // null = création
  const [form, setForm]               = useState(EMPTY_FORM);
  const [formError, setFormError]     = useState(null);
  const [submitting, setSubmitting]   = useState(false);

  // ── Modal suppression ───────────────────────────────────────────────────────
  const [deleteTarget, setDeleteTarget] = useState(null);

  // ── Chargement initial ──────────────────────────────────────────────────────
  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getCategories();
      setCategories(data);
    } catch {
      setError('Impossible de charger les catégories.');
    } finally {
      setLoading(false);
    }
  };

  // ── Ouverture des modals ────────────────────────────────────────────────────
  const openCreateModal = () => {
    setEditingCat(null);
    setForm(EMPTY_FORM);
    setFormError(null);
    setShowModal(true);
  };

  const openEditModal = (cat) => {
    setEditingCat(cat);
    setForm({ name: cat.name, description: cat.description ?? '' });
    setFormError(null);
    setShowModal(true);
  };

  // ── Soumission formulaire ───────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setFormError('Le nom de la catégorie est obligatoire.');
      return;
    }
    try {
      setSubmitting(true);
      setFormError(null);
      if (editingCat) {
        const updated = await updateCategory(editingCat.id, form);
        setCategories((prev) => prev.map((c) => (c.id === editingCat.id ? updated : c)));
      } else {
        const created = await createCategory(form);
        setCategories((prev) => [...prev, created]);
      }
      setShowModal(false);
    } catch (err) {
      setFormError(err.response?.data?.message || 'Erreur lors de l\'enregistrement.');
    } finally {
      setSubmitting(false);
    }
  };

  // ── Suppression ─────────────────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteCategory(deleteTarget.id);
      setCategories((prev) => prev.filter((c) => c.id !== deleteTarget.id));
    } catch {
      setError('Impossible de supprimer cette catégorie.');
    } finally {
      setDeleteTarget(null);
    }
  };

  // ── Rendu ──────────────────────────────────────────────────────────────────
  return (
    <div className="p-6 space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Gestion des catégories</h1>
          <p className="text-gray-500 text-sm mt-1">{categories.length} catégorie(s) configurée(s)</p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-xl hover:bg-indigo-700 transition font-medium text-sm"
        >
          ➕ Ajouter une catégorie
        </button>
      </div>

      {/* Erreur globale */}
      {error && (
        <div className="bg-red-50 border border-red-300 text-red-700 rounded-xl px-4 py-3 text-sm">
          ❌ {error}
        </div>
      )}

      {/* Tableau */}
      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-6 py-4 text-left">Nom</th>
                <th className="px-6 py-4 text-left">Description</th>
                <th className="px-6 py-4 text-center">Tickets</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {categories.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-10 text-gray-400">
                    Aucune catégorie. Cliquez sur "Ajouter" pour commencer.
                  </td>
                </tr>
              ) : (
                categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 font-medium text-gray-800">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-indigo-400 inline-block" />
                        {cat.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500 max-w-xs truncate">
                      {cat.description || <span className="italic text-gray-300">—</span>}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="bg-indigo-50 text-indigo-700 font-semibold px-3 py-1 rounded-full text-xs">
                        {cat.ticketCount ?? 0}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => openEditModal(cat)}
                          className="px-3 py-1.5 text-xs rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition font-medium"
                        >
                          ✏️ Modifier
                        </button>
                        <button
                          onClick={() => setDeleteTarget(cat)}
                          className="px-3 py-1.5 text-xs rounded-lg bg-red-50 text-red-700 hover:bg-red-100 transition font-medium"
                        >
                          🗑️ Supprimer
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Modal Création / Modification ── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-gray-800 mb-5">
              {editingCat ? '✏️ Modifier la catégorie' : '➕ Nouvelle catégorie'}
            </h2>

            {formError && (
              <div className="bg-red-50 border border-red-300 text-red-700 rounded-xl px-3 py-2.5 text-sm mb-4">
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Ex : Réseau, Matériel…"
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Décrivez cette catégorie…"
                  rows={3}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl text-gray-600 hover:bg-gray-50 transition text-sm font-medium"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-4 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition text-sm font-medium disabled:opacity-50"
                >
                  {submitting ? 'Enregistrement…' : editingCat ? 'Mettre à jour' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Modal de confirmation suppression ── */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        message={`Êtes-vous sûr de vouloir supprimer la catégorie "${deleteTarget?.name}" ? Cette action est irréversible.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};

export default CategoryManagement;
