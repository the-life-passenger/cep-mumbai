import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import {
  Layers,
  CheckCircle2,
  ClipboardList,
  MessageSquare,
  PlusCircle,
  Tag,
  ArrowRight,
  TrendingUp,
  ShieldAlert,
  Accessibility,
  Flame,
  Clock
} from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const PIE_COLORS = ['#0d9488', '#2563eb', '#e11d48', '#d97706', '#0891b2', '#ea580c', '#4f46e5', '#10b981'];

export default function AdminDashboardPage() {
  const { adminUser } = useAuth();
  const [serviceStats, setServiceStats] = useState(null);
  const [surveyStats, setSurveyStats] = useState(null);
  const [allFeedback, setAllFeedback] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [servs, survs, fbs] = await Promise.all([
          api.getServiceStats(),
          api.getSurveyStats(),
          api.getAllFeedback()
        ]);
        setServiceStats(servs);
        setSurveyStats(survs);
        setAllFeedback(fbs);
      } catch (err) {
        console.error('Failed to load admin stats:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  const pendingFeedbackCount = allFeedback.filter((f) => !f.approved).length;

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* 1. Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
            Welcome back, {adminUser?.name || 'Admin'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Overview of cataloged public services, resident survey submissions, and website operations.
          </p>
        </div>

        {/* Quick action buttons */}
        <div className="flex items-center gap-3">
          <Link
            to="/admin/services"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-sm transition active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add New Service</span>
          </Link>
          <Link
            to="/admin/categories"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-sm transition active:scale-95"
          >
            <Tag className="w-4 h-4" />
            <span>Manage Categories</span>
          </Link>
        </div>
      </div>

      {/* 2. Top Stats KPIs */}
      {serviceStats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Total Services */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Total Services
              </span>
              <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
                <Layers className="w-4 h-4" />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-slate-900 font-sans">
              {serviceStats.total}
            </p>
            <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1">
              <span>{serviceStats.demoCount || 0} Demo Records</span>
              <Link to="/admin/services" className="text-teal-700 hover:underline font-bold">
                Manage →
              </Link>
            </div>
          </div>

          {/* Card 2: Verified Services */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Verified Services
              </span>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-emerald-700 font-sans">
              {serviceStats.verified}
            </p>
            <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1">
              <span>{Math.round((serviceStats.verified / (serviceStats.total || 1)) * 100)}% Verified</span>
              <span className="text-slate-400">Ground Checked</span>
            </div>
          </div>

          {/* Card 3: Survey Responses */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Survey Responses
              </span>
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <ClipboardList className="w-4 h-4" />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-blue-700 font-sans">
              {surveyStats ? surveyStats.totalResponses : 0}
            </p>
            <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1">
              <span>Community Questionnaire</span>
              <Link to="/admin/surveys" className="text-blue-700 hover:underline font-bold">
                Review →
              </Link>
            </div>
          </div>

          {/* Card 4: Feedback & Moderation */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Total Feedback
              </span>
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <MessageSquare className="w-4 h-4" />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-slate-900 font-sans">
              {allFeedback.length}
            </p>
            <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1">
              <span className={pendingFeedbackCount > 0 ? 'text-amber-700 font-bold' : ''}>
                {pendingFeedbackCount} Pending Approval
              </span>
              <Link to="/admin/feedback" className="text-amber-700 hover:underline font-bold">
                Moderate →
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* 3. Recharts Statistical Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Services by Category */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900">Services by Category</h3>
            <span className="text-[11px] text-slate-400">Distribution</span>
          </div>

          <div className="h-64 w-full">
            {serviceStats && serviceStats.byCategory ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={serviceStats.byCategory} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} angle={-20} textAnchor="end" />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#0d9488" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">
                Loading category chart...
              </div>
            )}
          </div>
        </div>

        {/* Chart 2: Services by Locality */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900">Services by Locality</h3>
            <span className="text-[11px] text-slate-400">Geographic Spread</span>
          </div>

          <div className="h-64 w-full">
            {serviceStats && serviceStats.byLocality ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={serviceStats.byLocality} margin={{ top: 10, right: 10, left: -20, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#2563eb" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">
                Loading locality chart...
              </div>
            )}
          </div>
        </div>

        {/* Chart 3: Community Reported Problems */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900">Community Access Bottlenecks</h3>
            <span className="text-[11px] text-slate-400">From Resident Survey</span>
          </div>

          <div className="h-64 w-full">
            {surveyStats && surveyStats.problemStats && surveyStats.problemStats.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={surveyStats.problemStats} layout="vertical" margin={{ top: 5, right: 20, left: 35, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis type="number" tick={{ fontSize: 10 }} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 9 }} width={100} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#e11d48" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">
                No survey problem responses recorded yet.
              </div>
            )}
          </div>
        </div>

        {/* Chart 4: Accessibility Breakdown */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900">Accessibility Readiness</h3>
            <span className="text-[11px] text-slate-400">Wheelchair Compliance</span>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            {serviceStats ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Accessible', value: serviceStats.accessible || 0, color: '#0d9488' },
                      { name: 'Non-Accessible / Unverified', value: (serviceStats.total || 0) - (serviceStats.accessible || 0), color: '#cbd5e1' }
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    dataKey="value"
                  >
                    <Cell fill="#0d9488" />
                    <Cell fill="#cbd5e1" />
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-xs text-slate-400">Loading accessibility breakdown...</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
