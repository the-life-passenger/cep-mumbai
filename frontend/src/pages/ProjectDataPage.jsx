import React, { useState, useEffect } from 'react';
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
  BarChart3,
  PieChart as PieIcon,
  MapPin,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  Accessibility,
  ArrowRight,
  TrendingUp,
  FileSpreadsheet
} from 'lucide-react';
import { api } from '../services/api';
import { Link } from 'react-router-dom';

const CHART_COLORS = ['#0d9488', '#2563eb', '#e11d48', '#d97706', '#0891b2', '#ea580c', '#4f46e5', '#10b981'];

export default function ProjectDataPage() {
  const [serviceStats, setServiceStats] = useState(null);
  const [surveyStats, setSurveyStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const [servs, survs] = await Promise.all([
          api.getServiceStats(),
          api.getSurveyStats()
        ]);
        setServiceStats(servs);
        setSurveyStats(survs);
      } catch (err) {
        console.error('Failed to load project findings stats:', err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  const accessibilityData = serviceStats
    ? [
        { name: 'Wheelchair Accessible', value: serviceStats.accessible || 0, color: '#0d9488' },
        { name: 'Non-Accessible / Unverified', value: (serviceStats.total || 0) - (serviceStats.accessible || 0), color: '#cbd5e1' }
      ]
    : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      {/* 1. Header & Demo Data Alert */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 text-teal-300 text-xs font-semibold uppercase tracking-wider shadow-subtle">
          <BarChart3 className="w-3.5 h-3.5 text-teal-400" />
          <span>CEP Research Analytics</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-sans">
              Project Data & Fieldwork Findings
            </h1>
            <p className="text-sm sm:text-base text-slate-600 mt-1 max-w-2xl leading-relaxed">
              Spatial distribution, demographic access feedback, and physical accessibility metrics compiled for the University of Mumbai Community Engagement Project report.
            </p>
          </div>

          <div className="shrink-0 p-3 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 text-xs font-semibold max-w-xs space-y-1">
            <span className="flex items-center gap-1.5 text-amber-800 font-bold uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              Demo Data Notice
            </span>
            <p className="text-[11px] text-amber-700 leading-normal">
              Demo Data — Replace with Actual Field Survey Data upon completing on-ground ward visits.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Overview Metrics Cards */}
      {serviceStats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
            <span className="text-xs text-slate-500 font-medium uppercase tracking-wider block">
              Total Mapped Facilities
            </span>
            <p className="text-3xl font-extrabold text-slate-900 mt-2 font-sans">
              {serviceStats.total}
            </p>
            <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">
              {serviceStats.verified} verified
            </span>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
            <span className="text-xs text-slate-500 font-medium uppercase tracking-wider block">
              24/7 Trauma & Emergency
            </span>
            <p className="text-3xl font-extrabold text-rose-600 mt-2 font-sans">
              {serviceStats.emergency}
            </p>
            <span className="text-[11px] text-slate-500 mt-1 block">
              Round-the-clock availability
            </span>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
            <span className="text-xs text-slate-500 font-medium uppercase tracking-wider block">
              Survey Responses
            </span>
            <p className="text-3xl font-extrabold text-teal-700 mt-2 font-sans">
              {surveyStats ? surveyStats.totalResponses : 0}
            </p>
            <span className="text-[11px] text-teal-700 font-semibold mt-1 block">
              Resident community inputs
            </span>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
            <span className="text-xs text-slate-500 font-medium uppercase tracking-wider block">
              Barrier-Free Access
            </span>
            <p className="text-3xl font-extrabold text-slate-900 mt-2 font-sans">
              {serviceStats.total > 0
                ? `${Math.round((serviceStats.accessible / serviceStats.total) * 100)}%`
                : '0%'}
            </p>
            <span className="text-[11px] text-slate-500 mt-1 block">
              Ramp / ground access verified
            </span>
          </div>
        </div>
      )}

      {/* 3. Recharts Statistical Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Chart 1: Services by Category (Bar Chart) */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Services Cataloged by Category
            </h3>
            <p className="text-xs text-slate-500">Distribution across surveyed public categories.</p>
          </div>

          <div className="h-72 w-full pt-4">
            {serviceStats && serviceStats.byCategory ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={serviceStats.byCategory}
                  margin={{ top: 10, right: 10, left: -20, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 10, fill: '#64748b' }}
                    interval={0}
                    angle={-25}
                    textAnchor="end"
                  />
                  <YAxis tick={{ fontSize: 10, fill: '#64748b' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderRadius: '8px',
                      color: '#ffffff',
                      fontSize: '12px'
                    }}
                  />
                  <Bar dataKey="count" fill="#0d9488" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">
                Loading category charts...
              </div>
            )}
          </div>
        </div>

        {/* Chart 2: Services by Locality (Horizontal Bar or Column) */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Services by Surveyed Locality
            </h3>
            <p className="text-xs text-slate-500">Count of facilities identified per geographic ward.</p>
          </div>

          <div className="h-72 w-full pt-4">
            {serviceStats && serviceStats.byLocality ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={serviceStats.byLocality}
                  margin={{ top: 10, right: 10, left: -20, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 11, fill: '#64748b' }}
                  />
                  <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderRadius: '8px',
                      color: '#ffffff',
                      fontSize: '12px'
                    }}
                  />
                  <Bar dataKey="count" fill="#2563eb" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">
                Loading locality charts...
              </div>
            )}
          </div>
        </div>

        {/* Chart 3: Community Survey - Services Most Difficult to Access */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Community Access Bottlenecks
            </h3>
            <p className="text-xs text-slate-500">
              Services reported by residents as most difficult to locate or reach.
            </p>
          </div>

          <div className="h-72 w-full pt-4">
            {surveyStats && surveyStats.problemStats && surveyStats.problemStats.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={surveyStats.problemStats}
                  layout="vertical"
                  margin={{ top: 5, right: 20, left: 40, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis type="number" tick={{ fontSize: 10 }} />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tick={{ fontSize: 10, fill: '#334155' }}
                    width={110}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderRadius: '8px',
                      color: '#ffffff',
                      fontSize: '12px'
                    }}
                  />
                  <Bar dataKey="count" fill="#e11d48" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">
                No survey problem data available yet.
              </div>
            )}
          </div>
        </div>

        {/* Chart 4: Physical Accessibility Readiness (Pie Chart) */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Accessibility Infrastructure Readiness
            </h3>
            <p className="text-xs text-slate-500">
              Percentage of surveyed facilities equipped with wheelchair ramps.
            </p>
          </div>

          <div className="h-72 w-full pt-4 flex items-center justify-center">
            {accessibilityData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={accessibilityData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {accessibilityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderRadius: '8px',
                      color: '#ffffff',
                      fontSize: '12px'
                    }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-xs text-slate-400">Loading accessibility data...</div>
            )}
          </div>
        </div>
      </div>

      {/* 4. Qualitative Observations & Findings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Community Observations */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-teal-700" />
            <h3 className="font-bold text-slate-900 text-lg">Community Observations</h3>
          </div>
          <ul className="space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed list-disc list-inside">
            <li>
              <strong>Night Chemists:</strong> High disparity between daytime pharmacies and genuine 24-hour emergency medicine dispensaries.
            </li>
            <li>
              <strong>Sanitation Amenities:</strong> Public toilets near transit interchanges (e.g. railway stations) often suffer from irregular water supply and unclear gate closure times.
            </li>
            <li>
              <strong>Digital Contact Verification:</strong> Over 40% of municipal clinic landline numbers posted on older directories were disconnected or unmonitored.
            </li>
          </ul>
        </div>

        {/* Accessibility Observations */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <Accessibility className="w-5 h-5 text-teal-700" />
            <h3 className="font-bold text-slate-900 text-lg">Accessibility Observations</h3>
          </div>
          <ul className="space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed list-disc list-inside">
            <li>
              <strong>Curbs & Ramps:</strong> High curbs without transition ramps prevent wheelchair and walker access to community sanitation units.
            </li>
            <li>
              <strong>Signage & Legibility:</strong> Absence of high-contrast or tactile directional signs makes navigating ward civic offices challenging for elderly residents.
            </li>
            <li>
              <strong>Pedestrian Corridors:</strong> Footpaths connecting bus stops to municipal hospitals are often blocked by utility boxes.
            </li>
          </ul>
        </div>
      </div>

      {/* 5. Key Findings & Civic Recommendations */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-10 shadow-xl border border-slate-800 space-y-6">
        <div className="flex items-center gap-2 text-teal-400">
          <Lightbulb className="w-5 h-5" />
          <h3 className="text-xl font-bold tracking-tight text-white">
            Key Recommendations for Civic Authorities
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs sm:text-sm text-slate-300">
          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/60 space-y-2">
            <strong className="text-white block text-sm">1. Open Data API Adoption</strong>
            <p className="leading-relaxed">
              Municipal corporations should publish machine-readable, open GeoJSON feeds for all public hospitals, night chemist rosters, and operational sanitation blocks.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/60 space-y-2">
            <strong className="text-white block text-sm">2. Universal Accessibility Audit</strong>
            <p className="leading-relaxed">
              Mandate barrier-free wheelchair ramps and universal tactile paving along primary access paths to public healthcare dispensaries.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/60 space-y-2">
            <strong className="text-white block text-sm">3. Localized Emergency Signage</strong>
            <p className="leading-relaxed">
              Install solar-illuminated civic information totems at major transit hubs displaying nearest trauma centers and emergency numbers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
