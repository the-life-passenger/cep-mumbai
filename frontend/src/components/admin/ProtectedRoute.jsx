import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white text-xs">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 border-2 border-teal-400 border-t-transparent rounded-full animate-spin"></div>
          <span>Verifying administrator access...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
}
