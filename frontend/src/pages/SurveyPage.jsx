import React, { useState } from 'react';
import {
  ClipboardList,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  Building2,
  HeartHandshake,
  User,
  MapPin,
  HelpCircle,
  Accessibility,
  MessageSquare
} from 'lucide-react';
import { api } from '../services/api';
import { Link } from 'react-router-dom';

const SERVICE_OPTIONS = [
  'Hospitals & Trauma Care',
  'Pharmacies & Chemist (Night access)',
  'Public Toilets & Sanitation Blocks',
  'Police Stations & Chowkis',
  'Public Municipal Schools',
  'Fire Stations & Rescue',
  'Government Ward Offices & Aadhaar Seva'
];

const AGE_GROUPS = [
  'Under 18',
  '18-25 (Youth / Student)',
  '26-40 (Working Adult)',
  '41-60 (Middle Age)',
  '60+ (Senior Citizen)'
];

export default function SurveyPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  // Form Fields
  const [formData, setFormData] = useState({
    name: '',
    ageGroup: '18-25 (Youth / Student)',
    locality: '',
    serviceAccessProblem: 'Public Toilets & Sanitation Blocks',
    servicesAvailableNearby: [],
    problemsFindingInfo: '',
    accessibilityProblem: '',
    suggestions: '',
    comments: ''
  });

  const handleNearbyCheckbox = (option) => {
    setFormData((prev) => {
      const exists = prev.servicesAvailableNearby.includes(option);
      return {
        ...prev,
        servicesAvailableNearby: exists
          ? prev.servicesAvailableNearby.filter((item) => item !== option)
          : [...prev.servicesAvailableNearby, option]
      };
    });
  };

  const validateStep = () => {
    if (currentStep === 1) {
      if (!formData.locality.trim()) {
        setError('Please enter your locality or neighborhood');
        return false;
      }
    }
    if (currentStep === 2) {
      if (!formData.serviceAccessProblem) {
        setError('Please select which service is difficult to access');
        return false;
      }
    }
    setError(null);
    return true;
  };

  const handleNext = () => {
    if (validateStep()) {
      setCurrentStep((prev) => Math.min(prev + 1, 4));
    }
  };

  const handlePrev = () => {
    setError(null);
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep()) return;

    setSubmitting(true);
    setError(null);

    try {
      await api.submitSurvey(formData);
      setSubmitted(true);
    } catch (err) {
      setError(err.message || 'Failed to submit survey. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 sm:py-24 text-center">
        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-sm space-y-6">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
            Thank you for contributing to your community.
          </h2>

          <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-lg mx-auto">
            Your feedback helps our B.Sc. Computer Science research team identify civic infrastructure gaps and advocate for better public service transparency in Mumbai.
          </p>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 max-w-md mx-auto">
            <strong>Survey Locality:</strong> {formData.locality} • <strong>Problem Area:</strong> {formData.serviceAccessProblem}
          </div>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/services"
              className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow transition"
            >
              Explore Directory
            </Link>
            <Link
              to="/project-data"
              className="px-6 py-3 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 font-semibold text-sm border border-teal-200 transition"
            >
              View Research Findings
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-bold uppercase tracking-wider border border-teal-200/60">
          <HeartHandshake className="w-3.5 h-3.5 text-teal-600" />
          Community Engagement Survey
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-sans">
          Community Service Access Survey
        </h1>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          Part of University of Mumbai B.Sc. CS Semester V CEP syllabus. Share your localized experience finding and accessing essential civic services.
        </p>
      </div>

      {/* Multi-step Progress Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-subtle space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-slate-700">
          <span>Step {currentStep} of 4</span>
          <span className="text-teal-700 font-medium">
            {currentStep === 1 && 'About You'}
            {currentStep === 2 && 'Service Access'}
            {currentStep === 3 && 'Accessibility & Information'}
            {currentStep === 4 && 'Suggestions & Comments'}
          </span>
        </div>

        {/* Progress bar track */}
        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
          <div
            className="bg-teal-600 h-full transition-all duration-300 rounded-full"
            style={{ width: `${(currentStep / 4) * 100}%` }}
          />
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-800">
          {error}
        </div>
      )}

      {/* Main Multi-Step Form */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
        {/* STEP 1: ABOUT YOU */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-xl font-bold text-slate-900">Step 1: About You</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                We do not collect sensitive personal data. Your name is optional.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Your Name <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Ramesh S. or leave blank"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Age Group <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.ageGroup}
                onChange={(e) => setFormData({ ...formData, ageGroup: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none bg-white cursor-pointer"
              >
                {AGE_GROUPS.map((ag) => (
                  <option key={ag} value={ag}>
                    {ag}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Your Locality / Neighborhood <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Dadar West, Bandra, Kurla, Chembur"
                value={formData.locality}
                onChange={(e) => setFormData({ ...formData, locality: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* STEP 2: SERVICE ACCESS */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-xl font-bold text-slate-900">Step 2: Service Access</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Which essential civic facilities are most challenging to reach or locate?
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Which essential service is most difficult to access in your area? <span className="text-rose-500">*</span>
              </label>
              <div className="space-y-2">
                {SERVICE_OPTIONS.map((srv) => (
                  <label
                    key={srv}
                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition ${
                      formData.serviceAccessProblem === srv
                        ? 'bg-teal-50/80 border-teal-500 text-teal-900 font-semibold'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="serviceAccessProblem"
                      value={srv}
                      checked={formData.serviceAccessProblem === srv}
                      onChange={(e) => setFormData({ ...formData, serviceAccessProblem: e.target.value })}
                      className="text-teal-600 focus:ring-teal-500"
                    />
                    <span className="text-xs sm:text-sm">{srv}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Which services ARE available nearby? (Select all that apply)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {SERVICE_OPTIONS.map((opt) => (
                  <label
                    key={opt}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs cursor-pointer transition ${
                      formData.servicesAvailableNearby.includes(opt)
                        ? 'bg-slate-900 text-white font-semibold'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.servicesAvailableNearby.includes(opt)}
                      onChange={() => handleNearbyCheckbox(opt)}
                      className="rounded text-teal-600 focus:ring-teal-500"
                    />
                    <span>{opt}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: ACCESSIBILITY & INFORMATION */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-xl font-bold text-slate-900">Step 3: Accessibility & Information</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Information barriers and physical accessibility obstacles.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                What problems do you encounter finding service information?
              </label>
              <textarea
                rows={3}
                placeholder="e.g. Outdated phone numbers online, uncertain night pharmacy timings, no clear ward boundaries..."
                value={formData.problemsFindingInfo}
                onChange={(e) => setFormData({ ...formData, problemsFindingInfo: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Accessibility obstacles for elderly or persons with disabilities
              </label>
              <textarea
                rows={3}
                placeholder="e.g. Lack of wheelchair ramps at the local dispensary, steep curbs at toilet blocks, no tactile signage..."
                value={formData.accessibilityProblem}
                onChange={(e) => setFormData({ ...formData, accessibilityProblem: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* STEP 4: SUGGESTIONS */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-xl font-bold text-slate-900">Step 4: Suggestions & Recommendations</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Your ideas will be synthesized in our CEP project report for civic authorities.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Your suggestions for improving public services in your area
              </label>
              <textarea
                rows={3}
                placeholder="e.g. Install illuminated digital boards at railway stations showing 24/7 chemist lists, add more public water points..."
                value={formData.suggestions}
                onChange={(e) => setFormData({ ...formData, suggestions: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Additional comments for the student research team
              </label>
              <textarea
                rows={2}
                placeholder="Any other observations or thoughts..."
                value={formData.comments}
                onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            <div className="p-4 rounded-2xl bg-teal-50/70 border border-teal-200/60 text-xs text-teal-900 flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-teal-700 shrink-0" />
              <span>
                Your responses will be stored securely in the research repository and used solely for educational and community analysis.
              </span>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={handlePrev}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs sm:text-sm font-semibold hover:bg-slate-50 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : (
            <div></div>
          )}

          {currentStep < 4 ? (
            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold shadow transition active:scale-95"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs sm:text-sm font-bold shadow-md transition active:scale-95 disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{submitting ? 'Submitting Survey...' : 'Submit Survey Response'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
