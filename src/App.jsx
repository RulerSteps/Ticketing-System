/**
 * App.jsx — Point d'entrée React Router
 * Définit les routes de la partie administration.
 */

import { BrowserRouter, Routes, Route, Navigate, NavLink } from 'react-router-dom';
import DashboardAdmin    from './pages/admin/DashboardAdmin';
import UserManagement    from './pages/admin/UserManagement';
import CategoryManagement from './pages/admin/CategoryManagement';
import TicketAssignment  from './pages/admin/TicketAssignment';

// ── Barre de navigation latérale ──────────────────────────────────────────────
const Sidebar = () => {
  const navItems = [
    { to: '/admin/dashboard',       label: '📊 Tableau de bord' },
    { to: '/admin/users',           label: '👥 Utilisateurs'    },
    { to: '/admin/categories',      label: '🏷️ Catégories'      },
    { to: '/admin/tickets/assign',  label: '🎫 Assignation'     },
  ];

  return (
    <aside className="w-64 min-h-screen bg-indigo-900 text-white flex flex-col flex-shrink-0">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-indigo-700">
        <h1 className="text-lg font-bold tracking-tight">🖥️ Ticketing IT</h1>
        <p className="text-indigo-300 text-xs mt-0.5">Administration</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition ${
                isActive
                  ? 'bg-white/20 text-white'
                  : 'text-indigo-200 hover:bg-white/10 hover:text-white'
              }`
            }
          >
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Pied de sidebar */}
      <div className="px-6 py-4 border-t border-indigo-700 text-indigo-400 text-xs">
        GLSI2 — ESP Dakar 2025-2026
      </div>
    </aside>
  );
};

// ── Layout principal ───────────────────────────────────────────────────────────
const AdminLayout = ({ children }) => (
  <div className="flex min-h-screen bg-gray-100">
    <Sidebar />
    <main className="flex-1 overflow-auto">{children}</main>
  </div>
);

// ── Routes ─────────────────────────────────────────────────────────────────────
const App = () => (
  <BrowserRouter>
    <Routes>
      {/* Redirection racine → dashboard */}
      <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />

      {/* Routes admin */}
      <Route
        path="/admin/dashboard"
        element={<AdminLayout><DashboardAdmin /></AdminLayout>}
      />
      <Route
        path="/admin/users"
        element={<AdminLayout><UserManagement /></AdminLayout>}
      />
      <Route
        path="/admin/categories"
        element={<AdminLayout><CategoryManagement /></AdminLayout>}
      />
      <Route
        path="/admin/tickets/assign"
        element={<AdminLayout><TicketAssignment /></AdminLayout>}
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
    </Routes>
  </BrowserRouter>
);

export default App;
