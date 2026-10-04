import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import AdminStores from './pages/AdminStores';
import UserStores from './pages/UserStores';

function RequireAuth({ children, role }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center text-sm text-slate-300">Loading account...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (role && user.role !== role) {
    return <Navigate to={user.role === 'ADMIN' ? '/admin' : user.role === 'OWNER' ? '/owner' : '/stores'} replace />;
  }

  return children;
}

function UnderConstruction({ title }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top_left,_rgba(20,184,166,0.22),transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(139,92,246,0.23),transparent_35%),#020817] px-6">
      <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-white/5 p-8 text-center shadow-glass backdrop-blur-xl">
        <div className="text-xs uppercase tracking-[0.24em] text-teal-300">RateIt</div>
        <h1 className="mt-4 text-3xl font-bold text-white">{title}</h1>
        <p className="mt-3 text-slate-300">This view is part of the next UI phase and is intentionally left for the next role-specific build.</p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route
        path="/admin"
        element={
          <RequireAuth role="ADMIN">
            <Sidebar>
              <AdminDashboard />
            </Sidebar>
          </RequireAuth>
        }
      />
      <Route
        path="/admin/users"
        element={
          <RequireAuth role="ADMIN">
            <Sidebar>
              <AdminUsers />
            </Sidebar>
          </RequireAuth>
        }
      />
      <Route
        path="/admin/stores"
        element={
          <RequireAuth role="ADMIN">
            <Sidebar>
              <AdminStores />
            </Sidebar>
          </RequireAuth>
        }
      />

      <Route path="/stores" element={<RequireAuth role="USER"><UserStores /></RequireAuth>} />
      <Route path="/owner" element={<RequireAuth role="OWNER"><UnderConstruction title="Owner Dashboard" /></RequireAuth>} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
