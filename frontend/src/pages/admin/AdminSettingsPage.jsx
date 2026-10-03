import React, { useState, useEffect } from 'react';
import { KeyRound, Shield, CheckCircle2, Server, Database, Save } from 'lucide-react';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';

export default function AdminSettingsPage() {
  const toast = useToast();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);

  const [systemStatus, setSystemStatus] = useState(null);

  useEffect(() => {
    async function loadStatus() {
      try {
        const data = await api.getStatus();
        setSystemStatus(data);
      } catch (err) {
        console.error('Failed to load system status:', err);
      }
    }
    loadStatus();
  }, []);

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('New password and confirmation do not match');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }

    setSavingPassword(true);
    try {
      await api.changePassword({ currentPassword, newPassword });
      toast.success('Admin password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      toast.error(err.message || 'Failed to update password');
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
          Admin Settings & System Status
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Manage administrator account security and monitor backend database connectivity.
        </p>
      </div>

      {/* Card 1: Change Password */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <KeyRound className="w-5 h-5 text-teal-600" />
          <h2 className="font-bold text-base text-slate-900">Change Admin Password</h2>
        </div>

        <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-md text-xs sm:text-sm">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Current Password</label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">New Password</label>
            <input
              type="password"
              required
              placeholder="Minimum 6 characters"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Confirm New Password</label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={savingPassword}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm shadow transition active:scale-95 disabled:opacity-50"
          >
            <Save className="w-4 h-4 text-teal-400" />
            <span>{savingPassword ? 'Updating...' : 'Update Password'}</span>
          </button>
        </form>
      </div>

      {/* Card 2: System Architecture & Database Status */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <Server className="w-5 h-5 text-teal-600" />
          <h2 className="font-bold text-base text-slate-900">System Architecture & Database</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="text-xs text-slate-400 font-semibold block">Academic Project:</span>
            <span className="font-bold text-slate-900">
              {systemStatus?.project || 'University of Mumbai B.Sc. CS Semester V CEP'}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="text-xs text-slate-400 font-semibold block">Database Engine:</span>
            <span className="font-bold text-teal-700 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              {systemStatus?.database?.engine || 'Persistent Storage Engine'}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="text-xs text-slate-400 font-semibold block">Storage Mode:</span>
            <span className="font-mono text-slate-700">
              {systemStatus?.database?.mode === 'mongodb' ? 'MongoDB Native Connected' : 'Local Persistent JSON File System (Zero-Setup)'}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="text-xs text-slate-400 font-semibold block">Server Health:</span>
            <span className="font-bold text-emerald-700">Healthy (200 OK)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
