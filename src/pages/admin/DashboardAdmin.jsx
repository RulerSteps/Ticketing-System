/**
 * DashboardAdmin.jsx — Tableau de bord administrateur
 * Affiche :
 *   - 4 cartes KPI (Total / Ouverts / En cours / Résolus)
 *   - Graphique camembert : répartition par statut
 *   - Graphique barres : tickets par catégorie
 *   - Graphique courbes : évolution sur 7 jours
 *
 * Données : GET /api/stats/overview via ahmaApi.js
 */

import { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';
import { Pie, Bar, Line } from 'react-chartjs-2';
import StatCard from '../../components/shared/StatCard';
import { getStats } from '../../services/ahmaApi';

// Enregistrement des composants Chart.js utilisés
ChartJS.register(
  ArcElement,
  BarElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

// ── Données fictives pour le mode développement (quand l'API n'est pas disponible) ──
const MOCK_STATS = {
  total: 142,
  open: 38,
  inProgress: 54,
  resolved: 50,
  byCategory: [
    { name: 'Réseau', count: 45 },
    { name: 'Matériel', count: 32 },
    { name: 'Logiciel', count: 28 },
    { name: 'Sécurité', count: 20 },
    { name: 'Autre', count: 17 },
  ],
  byDay: [
    { date: 'Lun', count: 18 },
    { date: 'Mar', count: 22 },
    { date: 'Mer', count: 15 },
    { date: 'Jeu', count: 30 },
    { date: 'Ven', count: 25 },
    { date: 'Sam', count: 10 },
    { date: 'Dim', count: 8 },
  ],
};

const DashboardAdmin = () => {
  const [stats, setStats]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  // Chargement des statistiques depuis l'API
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await getStats();
        setStats(data);
      } catch (err) {
        console.warn('API non disponible, utilisation des données fictives', err);
        // En développement, on utilise les données mock
        setStats(MOCK_STATS);
        setError('Connexion API impossible — données de démonstration affichées.');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  // ── Spinner de chargement ──────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 text-sm">Chargement des statistiques…</p>
        </div>
      </div>
    );
  }

  // ── Données des graphiques ─────────────────────────────────────────────────
  const pieData = {
    labels: ['Ouverts', 'En cours', 'Résolus'],
    datasets: [{
      data: [stats.open, stats.inProgress, stats.resolved],
      backgroundColor: ['#3B82F6', '#F59E0B', '#10B981'],
      borderWidth: 2,
      borderColor: '#fff',
    }],
  };

  const barData = {
    labels: stats.byCategory?.map((c) => c.name) ?? [],
    datasets: [{
      label: 'Nombre de tickets',
      data: stats.byCategory?.map((c) => c.count) ?? [],
      backgroundColor: '#6366F1',
      borderRadius: 6,
    }],
  };

  const lineData = {
    labels: stats.byDay?.map((d) => d.date) ?? [],
    datasets: [{
      label: 'Tickets créés',
      data: stats.byDay?.map((d) => d.count) ?? [],
      borderColor: '#3B82F6',
      backgroundColor: 'rgba(59,130,246,0.1)',
      tension: 0.4,
      fill: true,
      pointBackgroundColor: '#3B82F6',
    }],
  };

  const chartOptions = {
    responsive: true,
    plugins: { legend: { position: 'bottom' } },
  };

  return (
    <div className="p-6 space-y-8">
      {/* Titre */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Tableau de bord</h1>
        <p className="text-gray-500 text-sm mt-1">Vue d'ensemble du système de ticketing</p>
      </div>

      {/* Bannière d'erreur / avertissement */}
      {error && (
        <div className="bg-yellow-50 border border-yellow-300 text-yellow-800 rounded-xl px-4 py-3 text-sm flex items-center gap-2">
          <span>⚠️</span> {error}
        </div>
      )}

      {/* ── 4 Cartes KPI ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard title="Total tickets"   value={stats.total}      icon="🎫" color="bg-indigo-500" />
        <StatCard title="Ouverts"         value={stats.open}       icon="📂" color="bg-blue-500"   />
        <StatCard title="En cours"        value={stats.inProgress} icon="⚙️" color="bg-amber-500"  />
        <StatCard title="Résolus"         value={stats.resolved}   icon="✅" color="bg-emerald-500"/>
      </div>

      {/* ── Graphiques ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Camembert */}
        <div className="bg-white rounded-2xl shadow p-5">
          <h2 className="text-base font-semibold text-gray-700 mb-4">Répartition par statut</h2>
          <Pie data={pieData} options={{ ...chartOptions, plugins: { legend: { position: 'bottom' } } }} />
        </div>

        {/* Barres */}
        <div className="bg-white rounded-2xl shadow p-5 lg:col-span-2">
          <h2 className="text-base font-semibold text-gray-700 mb-4">Tickets par catégorie</h2>
          <Bar data={barData} options={chartOptions} />
        </div>
      </div>

      {/* Courbe évolution 7 jours */}
      <div className="bg-white rounded-2xl shadow p-5">
        <h2 className="text-base font-semibold text-gray-700 mb-4">
          Évolution des tickets — 7 derniers jours
        </h2>
        <Line data={lineData} options={chartOptions} />
      </div>
    </div>
  );
};

export default DashboardAdmin;
