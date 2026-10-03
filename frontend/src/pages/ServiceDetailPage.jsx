import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  MapPin,
  Phone,
  Clock,
  CheckCircle2,
  Accessibility,
  Flame,
  Navigation,
  ArrowLeft,
  Share2,
  AlertTriangle,
  ExternalLink,
  ShieldCheck,
  Building2,
  Send
} from 'lucide-react';
import { api } from '../services/api';
import { DetailSkeleton } from '../components/common/Skeleton';
import InteractiveMap from '../components/map/InteractiveMap';
import ServiceCard from '../components/service/ServiceCard';
import Modal from '../components/common/Modal';
import { useToast } from '../context/ToastContext';
import { CategoryIcon } from '../utils/iconMap';

export default function ServiceDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Report Modal state
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportText, setReportText] = useState('');
  const [reportEmail, setReportEmail] = useState('');
  const [reporting, setReporting] = useState(false);

  useEffect(() => {
    async function loadService() {
      setLoading(true);
      setError(null);
      try {
        const data = await api.getServiceById(id);
        setService(data);
      } catch (err) {
        setError(err.message || 'Service could not be found');
      } finally {
        setLoading(false);
      }
    }
    loadService();
  }, [id]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: service.name,
          text: `Check out ${service.name} on MyLocal Services`,
          url: window.location.href,
        });
      } catch {}
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.info('Link copied to clipboard!');
    }
  };

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    if (!reportText.trim()) return;

    setReporting(true);
    try {
      // Submit as feedback / correction
      await api.submitFeedback({
        name: reportEmail ? `Report by ${reportEmail}` : 'Civic Reporter',
        rating: 4,
        feedback: `[CORRECTION REPORT for ${service.name} (ID: ${service.id})]: ${reportText.trim()}`,
        suggestion: 'Field Survey Verification'
      });
      toast.success('Thank you! Your report has been submitted to the project team for on-ground verification.');
      setReportModalOpen(false);
      setReportText('');
      setReportEmail('');
    } catch (err) {
      toast.error('Failed to submit report. Please try again.');
    } finally {
      setReporting(false);
    }
  };

  if (loading) return <DetailSkeleton />;

  if (error || !service) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <div className="p-6 bg-rose-50 border border-rose-200 rounded-2xl mb-4">
          <AlertTriangle className="w-10 h-10 text-rose-600 mx-auto mb-2" />
          <h2 className="text-lg font-bold text-rose-900">Service Not Found</h2>
          <p className="text-xs text-rose-700 mt-1">{error || 'This service record does not exist or has been removed.'}</p>
        </div>
        <Link
          to="/services"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Directory</span>
        </Link>
      </div>
    );
  }

  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${service.latitude},${service.longitude}`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link
          to="/services"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Services</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-subtle"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share</span>
          </button>

          <button
            onClick={() => setReportModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-50 border border-amber-200 text-xs font-semibold text-amber-800 hover:bg-amber-100 transition shadow-subtle"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            <span>Report Incorrect Info</span>
          </button>
        </div>
      </div>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left Column (8 cols): Service Info, Image & Description */}
        <div className="lg:col-span-8 space-y-6">
          {/* Header Card */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full flex items-center gap-1.5"
                style={{
                  backgroundColor: `${service.categoryColor || '#0d9488'}15`,
                  color: service.categoryColor || '#0d9488'
                }}
              >
                <CategoryIcon name={service.categoryIcon} className="w-4 h-4" />
                {service.categoryName}
              </span>

              {service.isDemo && (
                <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                  Demo Data
                </span>
              )}

              {service.verified && (
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Verified Facility
                </span>
              )}

              {service.emergencyAvailable && (
                <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse"></span>
                  24/7 Emergency Service
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight font-sans">
              {service.name}
            </h1>

            <div className="flex items-start gap-2 text-sm text-slate-600 pt-1">
              <MapPin className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-slate-800">{service.address}</p>
                <p className="text-slate-500">{service.locality}</p>
              </div>
            </div>
          </div>

          {/* Image Banner */}
          {service.image && (
            <div className="rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm max-h-[380px] w-full">
              <img
                src={service.image}
                alt={service.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Description & Overview */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
              About This Public Facility
            </h3>
            <p className="text-slate-700 text-sm sm:text-base leading-relaxed whitespace-pre-line">
              {service.description || 'No detailed civic overview available for this facility yet. Information is gathered through Mumbai University CEP field surveys.'}
            </p>

            {/* Accessibility & Special Facilities Card */}
            <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 space-y-1">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                  <Accessibility className="w-4 h-4 text-teal-600" />
                  <span>Accessibility Features</span>
                </div>
                <p className="text-xs text-slate-600">
                  {service.accessibilityAvailable
                    ? 'Wheelchair ramp, ground floor access, or barrier-free community facilities confirmed.'
                    : 'Accessibility ramp or elevators not verified during initial survey.'}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 space-y-1">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                  <Clock className="w-4 h-4 text-teal-600" />
                  <span>Operating Timings</span>
                </div>
                <p className="text-xs text-slate-600 font-medium">
                  {service.openingHours || 'Standard government working hours'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Quick Actions Card & Mini Map */}
        <div className="lg:col-span-4 space-y-6">
          {/* Quick Actions Card */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-base text-slate-900">Contact & Navigation</h3>

            {service.phone && (
              <a
                href={`tel:${service.phone.replace(/[^0-9+]/g, '')}`}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-sm shadow transition active:scale-95"
              >
                <Phone className="w-4 h-4" />
                <span>Call {service.phone}</span>
              </a>
            )}

            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow transition active:scale-95"
            >
              <Navigation className="w-4 h-4 text-teal-400" />
              <span>Get Directions (Maps)</span>
            </a>

            <div className="pt-4 border-t border-slate-100 text-xs text-slate-500 space-y-2">
              <div className="flex justify-between">
                <span>Latitude:</span>
                <span className="font-mono text-slate-700">{service.latitude}</span>
              </div>
              <div className="flex justify-between">
                <span>Longitude:</span>
                <span className="font-mono text-slate-700">{service.longitude}</span>
              </div>
              <div className="flex justify-between">
                <span>Data Source:</span>
                <span className="text-slate-700 font-medium">University CEP Fieldwork</span>
              </div>
            </div>
          </div>

          {/* Interactive Mini Map */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-4 shadow-sm space-y-2">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500 px-2">
              Location on Map
            </h4>
            <div className="h-64 rounded-2xl overflow-hidden">
              <InteractiveMap
                services={[service]}
                selectedService={service}
                center={[service.latitude, service.longitude]}
                zoom={15}
                className="w-full h-full"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Related Nearby Services */}
      {service.related && service.related.length > 0 && (
        <div className="pt-8 border-t border-slate-200 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                Nearby & Similar Facilities
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Other essential public services cataloged in or near {service.locality}.
              </p>
            </div>
            <Link
              to="/services"
              className="text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1"
            >
              <span>Explore All</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {service.related.map((rel) => (
              <ServiceCard key={rel.id} service={rel} />
            ))}
          </div>
        </div>
      )}

      {/* Report Modal */}
      <Modal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        title="Report Incorrect Information"
      >
        <form onSubmit={handleReportSubmit} className="space-y-4">
          <p className="text-xs text-slate-600">
            Help the B.Sc. CS research team keep our community map accurate. Please detail what is incorrect (e.g. wrong phone number, updated timings, or shifted location).
          </p>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Your Email / Contact (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. resident@gmail.com"
              value={reportEmail}
              onChange={(e) => setReportEmail(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Correction Details <span className="text-rose-500">*</span>
            </label>
            <textarea
              required
              rows={4}
              placeholder="Describe the issue with this listing..."
              value={reportText}
              onChange={(e) => setReportText(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setReportModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={reporting}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5 text-teal-400" />
              <span>{reporting ? 'Submitting...' : 'Submit Report'}</span>
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
