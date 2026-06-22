/**
 * UserManagement.jsx — Gestion des utilisateurs (Admin)
 * Fonctionnalités :
 *   - Tableau avec Nom, Email, Rôle, Statut, Actions
 *   - Recherche par nom ou email
 *   - Filtre par rôle
 *   - Ajout d'un utilisateur (modal)
 *   - Modification d'un utilisateur (modal pré-rempli)
 *   - Activation / Désactivation avec confirmation
 *
 * API : GET /api/users | POST /api/users | PUT /api/users/:id | PATCH /api/users/:id/toggle-status
 */

import { useEffect, useState } from 'react';
import ConfirmModal from '../../components/shared/ConfirmModal';
import { getUsers, createUser, updateUser, toggleUserStatus } from '../../services/ahmaApi';

// ── Formulaire vide par défaut ─────────────────────────────────────────────────
const EMPTY_FORM = { name: '', email: '', role: 'UTILISATEUR', password: '' };

// ── Libellés et couleurs des rôles ────────────────────────────────────────────
const ROLE_BADGE = {
  ADMIN:        'bg-purple-100 text-purple-800',
  TECHNICIEN:   'bg-blue-100 text-blue-800',
  UTILISATEUR:  'bg-gray-100 text-gray-700',
};

const UserManagement = () => {
  // ── État principal ──────────────────────────────────────────────────────────
  const [users, setUsers]             = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);

  // ── Filtres ─────────────────────────────────────────────────────────────────
  const [search, setSearch]           = useState('');
  const [roleFilter, setRoleFilter]   = useState('TOUS');

  // ── Modal utilisateur (création / modification) ────────────────────────────
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser]     = useState(null); // null = création
  const [form, setForm]                   = useState(EMPTY_FORM);
  const [formError, setFormError]         = useState(null);
  const [submitting, setSubmitting]       = useState(false);

  // ── Modal de confirmation (toggle statut) ──────────────────────────────────
  const [confirmTarget, setConfirmTarget] = useState(null); // utilisateur à toggle

  // ── Chargement initial ─────────────────────────────────────────────────────
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getUsers();
      setUsers(data);
    } catch (err) {
      setError("Impossible de charger les utilisateurs. Vérifiez votre connexion.");
    } finally {
      setLoading(false);
    }
  };

  // ── Filtrage ───────────────────────────────────────────────────────────────
  const filteredUsers = users.filter((u) => {
    const matchSearch =
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === 'TOUS' || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  // ── Ouverture du modal ─────────────────────────────────────────────────────
  const openCreateModal = () => {
    setEditingUser(null);
    setForm(EMPTY_FORM);
    setFormError(null);
    setShowUserModal(true);
  };

  const openEditModal = (user) => {
    setEditingUser(user);
    setForm({ name: user.name, email: user.email, role: user.role, password: '' });
    setFormError(null);
    setShowUserModal(true);
  };

  // ── Soumission du formulaire ───────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) {
      setFormError('Le nom et l\'email sont obligatoires.');
      return;
    }
    try {
      setSubmitting(true);
      setFormError(null);
      if (editingUser) {
        const updated = await updateUser(editingUser.id, form);
        setUsers((prev) => prev.map((u) => (u.id === editingUser.id ? updated : u)));
      } else {
        const created = await createUser(form);
        setUsers((prev) => [...prev, created]);
      }
      setShowUserModal(false);
    } catch (err) {
      setFormError(err.response?.data?.message || 'Une erreur est survenue.');
    } finally {
      setSubmitting(false);
    }
  };

  // ── Toggle statut ──────────────────────────────────────────────────────────
  const handleToggleStatus = async () => {
    if (!confirmTarget) return;
    try {
      const updated = await toggleUserStatus(confirmTarget.id);
      setUsers((prev) => prev.map((u) => (u.id === confirmTarget.id ? updated : u)));
    } catch {
      setError('Impossible de modifier le statut de l\'utilisateur.');
    } finally {
      setConfirmTarget(null);
    }
  };

  // ── Rendu ──────────────────────────────────────────────────────────────────
  return (
    <div className="p-6 space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Gestion des utilisateurs</h1>
          <p className="text-gray-500 text-sm mt-1">{users.length} utilisateur(s) au total</p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-xl hover:bg-indigo-700 transition font-medium text-sm"
        >
          <span>➕</span> Ajouter un utilisateur
        </button>
      </div>

      {/* Erreur globale */}
      {error && (
        <div className="bg-red-50 border border-red-300 text-red-700 rounded-xl px-4 py-3 text-sm">
          ❌ {error}
        </div>
      )}

      {/* Filtres */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Rechercher par nom ou email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          <option value="TOUS">Tous les rôles</option>
          <option value="ADMIN">Admin</option>
          <option value="TECHNICIEN">Technicien</option>
          <option value="UTILISATEUR">Utilisateur</option>
        </select>
      </div>

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
                <th className="px-6 py-4 text-left">Email</th>
                <th className="px-6 py-4 text-left">Rôle</th>
                <th className="px-6 py-4 text-left">Statut</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-gray-400">
                    Aucun utilisateur trouvé.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition">
                    {/* Nom + avatar */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs flex-shrink-0">
                          {user.name?.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-gray-800">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{user.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${ROLE_BADGE[user.role] ?? 'bg-gray-100 text-gray-600'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${user.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {user.active ? 'Actif' : 'Inactif'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => openEditModal(user)}
                          className="px-3 py-1.5 text-xs rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition font-medium"
                        >
                          ✏️ Modifier
                        </button>
                        <button
                          onClick={() => setConfirmTarget(user)}
                          className={`px-3 py-1.5 text-xs rounded-lg font-medium transition ${
                            user.active
                              ? 'bg-red-50 text-red-700 hover:bg-red-100'
                              : 'bg-green-50 text-green-700 hover:bg-green-100'
                          }`}
                        >
                          {user.active ? '🔒 Désactiver' : '🔓 Activer'}
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
      {showUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowUserModal(false)}>
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-gray-800 mb-5">
              {editingUser ? '✏️ Modifier l\'utilisateur' : '➕ Nouvel utilisateur'}
            </h2>

            {formError && (
              <div className="bg-red-50 border border-red-300 text-red-700 rounded-xl px-3 py-2.5 text-sm mb-4">
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Prénom Nom"
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="prenom.nom@example.com"
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rôle</label>
                <select
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                >
                  <option value="UTILISATEUR">Utilisateur</option>
                  <option value="TECHNICIEN">Technicien</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>
              {/* Mot de passe uniquement en création */}
              {!editingUser && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe *</label>
                  <input
                    type="password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder="••••••••"
                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    required={!editingUser}
                  />
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowUserModal(false)}
                  className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl text-gray-600 hover:bg-gray-50 transition text-sm font-medium"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-4 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition text-sm font-medium disabled:opacity-50"
                >
                  {submitting ? 'Enregistrement…' : editingUser ? 'Mettre à jour' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Modal de confirmation toggle statut ── */}
      <ConfirmModal
        isOpen={!!confirmTarget}
        message={`Voulez-vous ${confirmTarget?.active ? 'désactiver' : 'activer'} le compte de "${confirmTarget?.name}" ?`}
        onConfirm={handleToggleStatus}
        onCancel={() => setConfirmTarget(null)}
      />
    </div>
  );
};

export default UserManagement;
