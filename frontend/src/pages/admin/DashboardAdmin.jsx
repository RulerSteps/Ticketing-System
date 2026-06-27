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

const MOCK_STATS = {
  total: 142,
  open: 38,
  inProgress: 54,
  resolved: 50,
  byCategory: [
    { name: 'Reseau', count: 45 },
    { name: 'Materiel', count: 32 },
    { name: 'Logiciel', count: 28 },
    { name: 'Securite', count: 20 },
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

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
      labels: { boxWidth: 12, padding: 16, font: { size: 11, weight: '600' } },
    },
  },
};

const DashboardAdmin = () => {
  const [stats, setStats]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await getStats();
        setStats(data);
      } catch (err) {
        console.warn('API non disponible, utilisation des donnees fictives', err);
        setStats(MOCK_STATS);
        setError('Connexion API impossible — donnees de demonstration affichees.');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-indigo-400 font-medium text-sm">Chargement des statistiques...</p>
        </div>
      </div>
    );
  }

  const pieData = {
    labels: ['Ouverts', 'En cours', 'Resolus'],
    datasets: [{
      data: [stats.open, stats.inProgress, stats.resolved],
      backgroundColor: ['#6366f1', '#f59e0b', '#10b981'],
      borderWidth: 2,
      borderColor: '#fff',
    }],
  };

  const barData = {
    labels: stats.byCategory?.map((c) => c.name) ?? [],
    datasets: [{
      label: 'Tickets',
      data: stats.byCategory?.map((c) => c.count) ?? [],
      backgroundColor: ['#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#ec4899'],
      borderRadius: 6,
      maxBarThickness: 50,
    }],
  };

  const lineData = {
    labels: stats.byDay?.map((d) => d.date) ?? [],
    datasets: [{
      label: 'Tickets crees',
      data: stats.byDay?.map((d) => d.count) ?? [],
      borderColor: '#6366f1',
      backgroundColor: 'rgba(99,102,241,0.1)',
      tension: 0.4,
      fill: true,
      pointRadius: 4,
      pointBackgroundColor: '#6366f1',
      pointBorderColor: '#fff',
      pointBorderWidth: 2,
      borderWidth: 3,
    }],
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 rounded-2xl px-8 py-6 shadow-xl shadow-indigo-200/50 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-20 translate-x-20" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-16 -translate-x-16" />
          <h1 className="text-white text-xl font-bold relative">Tableau de bord</h1>
          <p className="text-white/60 text-sm mt-1 relative">Vue d ensemble du systeme de ticketing</p>
        </div>

        {error && (
          <div className="bg-amber-50 border-l-4 border-amber-500 text-amber-700 rounded-xl px-5 py-3.5 text-sm shadow-md shadow-amber-100">
            {error}
          </div>
        )}

        {/* KPI Cards */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard title="Total tickets"   value={stats.total}      color="bg-gradient-to-br from-indigo-600 to-indigo-800" />
          <StatCard title="Ouverts"         value={stats.open}       color="bg-gradient-to-br from-purple-500 to-purple-700" />
          <StatCard title="En cours"        value={stats.inProgress} color="bg-gradient-to-br from-amber-500 to-amber-700" />
          <StatCard title="Resolus"         value={stats.resolved}   color="bg-gradient-to-br from-emerald-500 to-emerald-700" />
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-indigo-100 shadow-xl shadow-indigo-100/30 p-6">
            <h2 className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-4">Repartition par statut</h2>
            <div className="h-56 flex items-center justify-center">
              <Pie data={pieData} options={{ ...chartOptions, cutout: '60%' }} />
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-indigo-100 shadow-xl shadow-indigo-100/30 p-6 lg:col-span-2">
            <h2 className="text-xs font-bold text-purple-600 uppercase tracking-wider mb-4">Tickets par categorie</h2>
            <div className="h-56">
              <Bar data={barData} options={chartOptions} />
            </div>
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-indigo-100 shadow-xl shadow-indigo-100/30 p-6">
          <h2 className="text-xs font-bold text-pink-600 uppercase tracking-wider mb-4">Evolution — 7 derniers jours</h2>
          <div className="h-56">
            <Line data={lineData} options={chartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardAdmin;
