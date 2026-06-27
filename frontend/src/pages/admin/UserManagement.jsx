import { useEffect, useState } from 'react';
import ConfirmModal from '../../components/shared/ConfirmModal';
import StatCard from '../../components/shared/StatCard';
import { getUsers, createUser, updateUser, toggleUserStatus } from '../../services/ahmaApi';

const EMPTY_FORM = { name: '', email: '', role: 'utilisateur', password: '' };

const ROLE_BADGE = {
  administrateur: 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-200',
  technicien:     'bg-gradient-to-r from-sky-500 to-cyan-500 text-white shadow-md shadow-sky-200',
  utilisateur:    'bg-gradient-to-r from-gray-500 to-gray-400 text-white shadow-md shadow-gray-200',
};

const UserManagement = () => {
  const [users, setUsers]           = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);
  const [search, setSearch]         = useState('');
  const [roleFilter, setRoleFilter] = useState('TOUS');
  const [showModal, setShowModal]   = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form, setForm]             = useState(EMPTY_FORM);
  const [formError, setFormError]   = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [confirmTarget, setConfirmTarget] = useState(null);

  useEffect(() => { loadUsers(); }, []);

  const loadUsers = async () => {
    try { setLoading(true); setError(null); setUsers(await getUsers()); }
    catch { setError('Impossible de charger les utilisateurs.'); }
    finally { setLoading(false); }
  };

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    const role = (u.role?.nom || u.role || '').toLowerCase();
    return (u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q)) &&
      (roleFilter === 'TOUS' || role === roleFilter.toLowerCase());
  });

  const openCreate = () => { setEditingUser(null); setForm(EMPTY_FORM); setFormError(null); setShowModal(true); };
  const openEdit = (u) => { setEditingUser(u); setForm({ name: u.name, email: u.email, role: u.role?.nom || u.role || 'utilisateur', password: '' }); setFormError(null); setShowModal(true); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) { setFormError('Le nom et l\'email sont requis.'); return; }
    try {
      setSubmitting(true); setFormError(null);
      if (editingUser) {
        const updated = await updateUser(editingUser.id, form);
        setUsers((prev) => prev.map((u) => (u.id === editingUser.id ? updated : u)));
      } else {
        const created = await createUser(form);
        setUsers((prev) => [...prev, created]);
      }
      setShowModal(false);
    } catch (err) { setFormError(err.response?.data?.message || 'Erreur lors de l\'enregistrement.'); }
    finally { setSubmitting(false); }
  };

  const handleToggle = async () => {
    if (!confirmTarget) return;
    try {
      const updated = await toggleUserStatus(confirmTarget.id);
      setUsers((prev) => prev.map((u) => (u.id === confirmTarget.id ? updated : u)));
    } catch { setError('Impossible de modifier le statut.'); }
    finally { setConfirmTarget(null); }
  };

  const getRole = (u) => (u.role?.nom || u.role || '').toLowerCase();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 rounded-2xl px-8 py-6 mb-8 flex items-center justify-between shadow-xl shadow-indigo-200/50 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-20 translate-x-20" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-16 -translate-x-16" />
          <div>
            <h1 className="text-white text-xl font-bold">Gestion des Utilisateurs</h1>
            <p className="text-white/60 text-sm mt-1">{users.length} utilisateur{users.length > 1 ? 's' : ''} enregistre{users.length > 1 ? 's' : ''} sur la plateforme</p>
          </div>
          <button onClick={openCreate}
            className="bg-white/20 backdrop-blur-sm text-white px-5 py-2.5 rounded-xl hover:bg-white/30 transition-all text-sm font-semibold shadow-lg border border-white/20">
            + Nouvel utilisateur
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <StatCard title="Total" value={users.length} color="bg-gradient-to-br from-indigo-600 to-indigo-800" />
          <StatCard title="Administrateurs" value={users.filter((u) => getRole(u) === 'administrateur').length} color="bg-gradient-to-br from-purple-500 to-purple-700" />
          <StatCard title="Techniciens" value={users.filter((u) => getRole(u) === 'technicien').length} color="bg-gradient-to-br from-sky-500 to-sky-700" />
          <StatCard title="Utilisateurs" value={users.filter((u) => getRole(u) === 'utilisateur').length} color="bg-gradient-to-br from-emerald-500 to-emerald-700" />
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 rounded-xl px-5 py-3.5 text-sm mb-6 shadow-md shadow-red-100">{error}</div>
        )}

        {/* Filtres */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-indigo-100 shadow-lg shadow-indigo-100/50 p-5 mb-6 flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-1 relative">
            <input type="text" placeholder="Rechercher un utilisateur..." value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-indigo-50/50 border-0 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400/40 transition-all placeholder:text-gray-400" />
          </div>
          <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-indigo-50/50 border-0 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400/40 transition-all">
            <option value="TOUS">Tous les roles</option>
            <option value="ADMIN">Admin</option>
            <option value="TECHNICIEN">Technicien</option>
            <option value="UTILISATEUR">Utilisateur</option>
          </select>
        </div>

        {/* Tableau */}
        {loading ? (
          <div className="flex justify-center py-24">
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-indigo-400 font-medium">Chargement des utilisateurs...</p>
            </div>
          </div>
        ) : (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-indigo-100 shadow-xl shadow-indigo-100/30 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500">
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Nom</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Email</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Role</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Statut</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-white uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-indigo-50">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-20">
                      <p className="text-sm text-gray-400">Aucun utilisateur trouve</p>
                    </td>
                  </tr>
                ) : (
                  filtered.map((user, i) => (
                    <tr key={user.id} className={`transition-all duration-200 ${i % 2 === 0 ? 'bg-white/60' : 'bg-indigo-50/30'} hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50/50 hover:scale-[1.002]`}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-400 text-white flex items-center justify-center font-bold text-sm shadow-lg shadow-indigo-200 flex-shrink-0">
                            {user.name?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <span className="text-sm font-semibold text-gray-800">{user.name}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{user.email}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-xl text-xs font-bold uppercase tracking-wide ${ROLE_BADGE[getRole(user)] ?? 'bg-gradient-to-r from-gray-500 to-gray-400 text-white'}`}>
                          {getRole(user)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2.5">
                          <span className={`w-2.5 h-2.5 rounded-full ${user.active ? 'bg-emerald-500 shadow-lg shadow-emerald-200' : 'bg-red-500 shadow-lg shadow-red-200'}`} />
                          <span className={`text-sm font-semibold ${user.active ? 'text-emerald-600' : 'text-red-500'}`}>
                            {user.active ? 'Actif' : 'Inactif'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => openEdit(user)}
                            className="px-4 py-2 text-xs font-bold text-indigo-600 bg-gradient-to-r from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 rounded-xl transition-all shadow-sm border border-indigo-100">
                            Modifier
                          </button>
                          <button onClick={() => setConfirmTarget(user)}
                            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all shadow-sm border ${
                              user.active
                                ? 'text-red-600 bg-red-50 border-red-100 hover:bg-red-100'
                                : 'text-emerald-600 bg-emerald-50 border-emerald-100 hover:bg-emerald-100'
                            }`}>
                            {user.active ? 'Desactiver' : 'Activer'}
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

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setShowModal(false)}>
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md mx-4 border border-indigo-50" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center gap-4 mb-6 pb-5 border-b border-indigo-50">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-400 text-white flex items-center justify-center font-bold text-lg shadow-lg shadow-indigo-200">
                  {form.name ? form.name.charAt(0).toUpperCase() : '?'}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">
                    {editingUser ? "Modifier l'utilisateur" : 'Nouvel utilisateur'}
                  </h2>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {editingUser ? 'Modifier les informations du compte' : 'Creer un nouveau compte'}
                  </p>
                </div>
              </div>

              {formError && (
                <div className="bg-red-50 border-l-4 border-red-500 text-red-700 rounded-xl px-4 py-3 text-sm mb-5">{formError}</div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Nom complet</label>
                  <input type="text" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})}
                    placeholder="Prenom Nom"
                    className="w-full bg-indigo-50/50 border border-indigo-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400/40 focus:border-indigo-300 transition-all" required />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
                  <input type="email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})}
                    placeholder="prenom@example.com"
                    className="w-full bg-indigo-50/50 border border-indigo-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400/40 focus:border-indigo-300 transition-all" required />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Role</label>
                  <select value={form.role} onChange={(e) => setForm({...form, role: e.target.value})}
                    className="w-full bg-indigo-50/50 border border-indigo-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400/40 focus:border-indigo-300 transition-all">
                    <option value="utilisateur">Utilisateur</option>
                    <option value="technicien">Technicien</option>
                    <option value="administrateur">Admin</option>
                  </select>
                </div>
                {!editingUser && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Mot de passe</label>
                    <input type="password" value={form.password} onChange={(e) => setForm({...form, password: e.target.value})}
                      placeholder="6 caracteres minimum"
                      className="w-full bg-indigo-50/50 border border-indigo-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400/40 focus:border-indigo-300 transition-all" required />
                  </div>
                )}
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowModal(false)}
                    className="flex-1 px-5 py-3 border border-indigo-100 rounded-xl text-sm text-indigo-600 hover:bg-indigo-50 transition-all font-semibold">
                    Annuler
                  </button>
                  <button type="submit" disabled={submitting}
                    className="flex-1 px-5 py-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white rounded-xl hover:from-indigo-700 hover:via-purple-700 hover:to-pink-600 transition-all text-sm font-bold disabled:opacity-50 shadow-lg shadow-indigo-200">
                    {submitting ? 'Enregistrement...' : editingUser ? 'Enregistrer' : 'Creer le compte'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <ConfirmModal isOpen={!!confirmTarget}
          message={`${confirmTarget?.active ? 'Desactiver' : 'Activer'} le compte de "${confirmTarget?.name}" ?`}
          onConfirm={handleToggle} onCancel={() => setConfirmTarget(null)} />
      </div>
    </div>
  );
};

export default UserManagement;
