import { useEffect, useState } from 'react';
import ConfirmModal from '../../components/shared/ConfirmModal';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../../services/ahmaApi';

const EMPTY_FORM = { name: '', description: '' };

const TAG_COLORS = [
  'from-teal-500 to-emerald-500',
  'from-cyan-500 to-blue-500',
  'from-violet-500 to-purple-500',
  'from-rose-500 to-pink-500',
  'from-amber-500 to-orange-500',
];

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);
  const [showModal, setShowModal]     = useState(false);
  const [editingCat, setEditingCat]   = useState(null);
  const [form, setForm]               = useState(EMPTY_FORM);
  const [formError, setFormError]     = useState(null);
  const [submitting, setSubmitting]   = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => { loadCategories(); }, []);

  const loadCategories = async () => {
    try { setLoading(true); setError(null); setCategories(await getCategories()); }
    catch { setError('Impossible de charger les categories.'); }
    finally { setLoading(false); }
  };

  const openCreate = () => { setEditingCat(null); setForm(EMPTY_FORM); setFormError(null); setShowModal(true); };
  const openEdit = (c) => { setEditingCat(c); setForm({ name: c.name, description: c.description ?? '' }); setFormError(null); setShowModal(true); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) { setFormError('Nom obligatoire.'); return; }
    try {
      setSubmitting(true); setFormError(null);
      if (editingCat) {
        const updated = await updateCategory(editingCat.id, form);
        setCategories((prev) => prev.map((c) => (c.id === editingCat.id ? updated : c)));
      } else {
        const created = await createCategory(form);
        setCategories((prev) => [...prev, created]);
      }
      setShowModal(false);
    } catch (err) { setFormError(err.response?.data?.message || 'Erreur.'); }
    finally { setSubmitting(false); }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try { await deleteCategory(deleteTarget.id); setCategories((prev) => prev.filter((c) => c.id !== deleteTarget.id)); }
    catch { setError('Impossible de supprimer.'); }
    finally { setDeleteTarget(null); }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-emerald-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-600 via-emerald-600 to-cyan-500 rounded-2xl px-8 py-6 mb-8 flex items-center justify-between shadow-xl shadow-teal-200/50 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-20 translate-x-20" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-16 -translate-x-16" />
          <div>
            <h1 className="text-white text-xl font-bold">Gestion des Categories</h1>
            <p className="text-white/60 text-sm mt-1">{categories.length} categorie{categories.length > 1 ? 's' : ''} enregistree{categories.length > 1 ? 's' : ''}</p>
          </div>
          <button onClick={openCreate}
            className="bg-white/20 backdrop-blur-sm text-white px-5 py-2.5 rounded-xl hover:bg-white/30 transition-all text-sm font-semibold shadow-lg border border-white/20">
            + Nouvelle categorie
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 rounded-xl px-5 py-3.5 text-sm mb-6 shadow-md shadow-red-100">{error}</div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
          <div className="bg-gradient-to-br from-teal-500 to-emerald-600 rounded-xl shadow-lg shadow-teal-100 p-5 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-white/5 rounded-full -translate-y-8 translate-x-8" />
            <p className="text-xs font-medium text-white/70 uppercase tracking-wider">Total categories</p>
            <p className="text-2xl font-bold mt-1">{categories.length}</p>
          </div>
          <div className="bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl shadow-lg shadow-cyan-100 p-5 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-white/5 rounded-full -translate-y-8 translate-x-8" />
            <p className="text-xs font-medium text-white/70 uppercase tracking-wider">Avec tickets</p>
            <p className="text-2xl font-bold mt-1">{categories.filter((c) => (c.ticketCount ?? 0) > 0).length}</p>
          </div>
          <div className="bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl shadow-lg shadow-violet-100 p-5 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-white/5 rounded-full -translate-y-8 translate-x-8" />
            <p className="text-xs font-medium text-white/70 uppercase tracking-wider">Vides</p>
            <p className="text-2xl font-bold mt-1">{categories.filter((c) => (c.ticketCount ?? 0) === 0).length}</p>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex justify-center py-24">
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-teal-400 font-medium">Chargement des categories...</p>
            </div>
          </div>
        ) : (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-teal-100 shadow-xl shadow-teal-100/30 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gradient-to-r from-teal-600 via-emerald-600 to-cyan-500">
                  {['Nom', 'Description', 'Tickets', 'Actions'].map((h) => (
                    <th key={h} className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-teal-50">
                {categories.length === 0 ? (
                  <tr><td colSpan={4} className="text-center py-20 text-gray-400 text-sm">Aucune categorie.</td></tr>
                ) : (
                  categories.map((cat, i) => (
                    <tr key={cat.id} className={`transition-all duration-200 ${i % 2 === 0 ? 'bg-white/60' : 'bg-teal-50/30'} hover:bg-gradient-to-r hover:from-teal-50 hover:to-emerald-50/50 hover:scale-[1.002]`}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${TAG_COLORS[i % TAG_COLORS.length]} text-white flex items-center justify-center font-bold text-sm shadow-lg`}>
                            {cat.name?.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-semibold text-gray-800">{cat.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-400 max-w-xs truncate">
                        {cat.description || <span className="italic text-gray-300">Aucune description</span>}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center justify-center min-w-[2.5rem] px-3 py-1 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-bold text-xs shadow-md shadow-teal-200">
                          {cat.ticketCount ?? 0}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button onClick={() => openEdit(cat)}
                            className="px-4 py-2 text-xs font-bold text-teal-600 bg-gradient-to-r from-teal-50 to-emerald-50 hover:from-teal-100 hover:to-emerald-100 rounded-xl transition-all shadow-sm border border-teal-100">
                            Modifier
                          </button>
                          <button onClick={() => setDeleteTarget(cat)}
                            className="px-4 py-2 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-all shadow-sm border border-red-100">
                            Supprimer
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
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md mx-4 border border-teal-50" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center gap-4 mb-6 pb-5 border-b border-teal-50">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-500 text-white flex items-center justify-center font-bold text-lg shadow-lg shadow-teal-200">
                  {form.name ? form.name.charAt(0).toUpperCase() : '?'}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">{editingCat ? 'Modifier la categorie' : 'Nouvelle categorie'}</h2>
                  <p className="text-xs text-gray-400 mt-0.5">{editingCat ? 'Modifier les informations' : 'Creer une nouvelle categorie'}</p>
                </div>
              </div>

              {formError && <div className="bg-red-50 border-l-4 border-red-500 text-red-700 rounded-xl px-4 py-3 text-sm mb-5">{formError}</div>}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Nom</label>
                  <input type="text" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})}
                    placeholder="Ex: Reseau, Materiel..." required
                    className="w-full bg-teal-50/50 border border-teal-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400/40 focus:border-teal-300 transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description</label>
                  <textarea value={form.description} onChange={(e) => setForm({...form, description: e.target.value})}
                    placeholder="Decrivez cette categorie..." rows={3}
                    className="w-full bg-teal-50/50 border border-teal-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400/40 focus:border-teal-300 transition-all resize-none" />
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowModal(false)}
                    className="flex-1 px-5 py-3 border border-teal-100 rounded-xl text-sm text-teal-600 hover:bg-teal-50 transition-all font-semibold">Annuler</button>
                  <button type="submit" disabled={submitting}
                    className="flex-1 px-5 py-3 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-xl hover:from-teal-700 hover:to-emerald-700 transition-all text-sm font-bold disabled:opacity-50 shadow-lg shadow-teal-200">
                    {submitting ? 'En cours...' : editingCat ? 'Mettre a jour' : 'Creer'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <ConfirmModal isOpen={!!deleteTarget}
          message={`Supprimer la categorie "${deleteTarget?.name}" ? Cette action est irreversible.`}
          onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />
      </div>
    </div>
  );
};

export default CategoryManagement;
