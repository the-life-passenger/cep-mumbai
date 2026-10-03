import React, { useState, useEffect } from 'react';
import { Save, FileText, CheckCircle2, Globe, Building2, Phone } from 'lucide-react';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';

export default function AdminContentPage() {
  const toast = useToast();
  const [content, setContent] = useState({
    heroBadge: '',
    heroHeading: '',
    heroDescription: '',
    aboutProblem: '',
    aboutObjective: '',
    contactEmail: '',
    contactPhone: '',
    contactLocality: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadContent() {
      try {
        const data = await api.getContent();
        setContent({
          heroBadge: data.heroBadge || '',
          heroHeading: data.heroHeading || '',
          heroDescription: data.heroDescription || '',
          aboutProblem: data.aboutProblem || '',
          aboutObjective: data.aboutObjective || '',
          contactEmail: data.contactEmail || '',
          contactPhone: data.contactPhone || '',
          contactLocality: data.contactLocality || ''
        });
      } catch (err) {
        toast.error('Failed to load content settings');
      } finally {
        setLoading(false);
      }
    }
    loadContent();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.updateContent(content);
      toast.success('Website content updated! Changes are live on public site.');
    } catch (err) {
      toast.error('Failed to update content');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
          Website Content Management
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Modify landing page copy, project descriptions, and academic contact info without editing source code.
        </p>
      </div>

      {loading ? (
        <div className="py-12 text-center text-xs text-slate-400">Loading settings...</div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Card 1: Homepage Hero Section */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Globe className="w-4 h-4 text-teal-600" />
              <h2 className="font-bold text-base text-slate-900">Homepage Hero Section</h2>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Hero Badge Text</label>
              <input
                type="text"
                value={content.heroBadge}
                onChange={(e) => setContent({ ...content, heroBadge: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Hero Main Heading</label>
              <input
                type="text"
                value={content.heroHeading}
                onChange={(e) => setContent({ ...content, heroHeading: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Hero Tagline / Description</label>
              <textarea
                rows={3}
                value={content.heroDescription}
                onChange={(e) => setContent({ ...content, heroDescription: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Card 2: About Page Academic Text */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Building2 className="w-4 h-4 text-teal-600" />
              <h2 className="font-bold text-base text-slate-900">Project Context (About Page)</h2>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Problem Statement</label>
              <textarea
                rows={4}
                value={content.aboutProblem}
                onChange={(e) => setContent({ ...content, aboutProblem: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Project Objective</label>
              <textarea
                rows={4}
                value={content.aboutObjective}
                onChange={(e) => setContent({ ...content, aboutObjective: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Card 3: Contact & Department Info */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Phone className="w-4 h-4 text-teal-600" />
              <h2 className="font-bold text-base text-slate-900">Project Contact Details</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Contact Email</label>
                <input
                  type="email"
                  value={content.contactEmail}
                  onChange={(e) => setContent({ ...content, contactEmail: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Contact Phone</label>
                <input
                  type="text"
                  value={content.contactPhone}
                  onChange={(e) => setContent({ ...content, contactPhone: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Survey City / Locality</label>
                <input
                  type="text"
                  value={content.contactLocality}
                  onChange={(e) => setContent({ ...content, contactLocality: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow transition active:scale-95 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Publishing Changes...' : 'Save & Publish Changes'}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
