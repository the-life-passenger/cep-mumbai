import React, { useState } from 'react';
import { NavLink, Link, useNavigate, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  Layers,
  Tag,
  ClipboardList,
  MessageSquare,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  ExternalLink,
  MapPin,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const ADMIN_NAV = [
  { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Services', path: '/admin/services', icon: Layers },
  { name: 'Categories', path: '/admin/categories', icon: Tag },
  { name: 'Survey Responses', path: '/admin/surveys', icon: ClipboardList },
  { name: 'Feedback Moderation', path: '/admin/feedback', icon: MessageSquare },
  { name: 'Website Content', path: '/admin/content', icon: FileText },
  { name: 'Settings', path: '/admin/settings', icon: Settings }
];

export default function AdminLayout() {
  const { adminUser, logout } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.info('Logged out from admin portal');
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 bg-slate-900 text-white border-b border-slate-800 px-4 sm:px-6 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            aria-label="Toggle admin sidebar"
          >
            {mobileDrawerOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <Link to="/admin/dashboard" className="flex items-center gap-2 font-bold text-white tracking-tight">
            <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-400 border border-teal-500/30 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <span className="hidden sm:inline">MyLocal</span>
            <span className="text-teal-400 font-mono text-xs px-2 py-0.5 rounded bg-slate-800 border border-slate-700">
              Admin Portal
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <Link
            to="/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs text-slate-300 hover:text-teal-400 transition"
          >
            <span>View Public Site</span>
            <ExternalLink className="w-3 h-3" />
          </Link>

          <div className="h-4 w-px bg-slate-800 hidden sm:block" />

          {/* Admin user info */}
          <div className="flex items-center gap-2 text-xs">
            <div className="w-7 h-7 rounded-full bg-teal-700 text-white font-bold flex items-center justify-center">
              {adminUser?.name ? adminUser.name.charAt(0).toUpperCase() : 'A'}
            </div>
            <span className="hidden md:inline text-slate-200 font-semibold">{adminUser?.name || 'Administrator'}</span>
          </div>

          <button
            onClick={handleLogout}
            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition"
            title="Log out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <aside
          className={`hidden lg:flex flex-col bg-slate-900 border-r border-slate-800 text-slate-300 transition-all duration-300 ${
            collapsed ? 'w-20' : 'w-64'
          }`}
        >
          {/* Navigation Links */}
          <div className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
            {ADMIN_NAV.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition group ${
                      isActive
                        ? 'bg-teal-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                    }`
                  }
                  title={collapsed ? item.name : undefined}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  {!collapsed && <span className="truncate">{item.name}</span>}
                </NavLink>
              );
            })}
          </div>

          {/* Collapse Toggle Footer */}
          <div className="p-3 border-t border-slate-800/80 flex items-center justify-between">
            {!collapsed && (
              <span className="text-[11px] text-slate-500 font-medium">B.Sc. CS Sem V CEP</span>
            )}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 ml-auto transition"
              aria-label="Collapse sidebar"
            >
              {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>
        </aside>

        {/* Mobile Slide-Out Drawer */}
        {mobileDrawerOpen && (
          <div className="lg:hidden fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm flex">
            <div className="w-64 bg-slate-900 text-white h-full p-4 flex flex-col justify-between shadow-2xl">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
                  <span className="font-bold text-sm tracking-wide">Admin Navigation</span>
                  <button
                    onClick={() => setMobileDrawerOpen(false)}
                    className="p-1 text-slate-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="space-y-1">
                  {ADMIN_NAV.map((item) => {
                    const Icon = item.icon;
                    return (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        onClick={() => setMobileDrawerOpen(false)}
                        className={({ isActive }) =>
                          `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition ${
                            isActive
                              ? 'bg-teal-600 text-white'
                              : 'text-slate-400 hover:text-white hover:bg-slate-800'
                          }`
                        }
                      >
                        <Icon className="w-5 h-5 shrink-0" />
                        <span>{item.name}</span>
                      </NavLink>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 space-y-2">
                <Link
                  to="/"
                  target="_blank"
                  className="w-full flex items-center justify-center gap-2 py-2 text-xs font-semibold text-slate-300 hover:text-white"
                >
                  <ExternalLink className="w-4 h-4" />
                  View Public Website
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full py-2 px-3 rounded-xl bg-rose-600/20 text-rose-300 hover:bg-rose-600 hover:text-white text-xs font-bold transition flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Log Out
                </button>
              </div>
            </div>
            <div className="flex-1" onClick={() => setMobileDrawerOpen(false)}></div>
          </div>
        )}

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
