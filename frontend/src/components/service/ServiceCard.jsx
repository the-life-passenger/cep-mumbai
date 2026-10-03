import React from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Phone,
  Clock,
  CheckCircle2,
  Accessibility,
  AlertCircle,
  Navigation,
  ChevronRight,
  Flame,
  ExternalLink
} from 'lucide-react';
import { CategoryIcon } from '../../utils/iconMap';

export default function ServiceCard({ service, categoryMap = {} }) {
  const category = categoryMap[service.categoryId] || {
    name: 'Essential Service',
    icon: 'Building2',
    color: '#0d9488'
  };

  // Build Google Maps / OSM directions link using coordinates
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${service.latitude},${service.longitude}`;

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between overflow-hidden hover:border-slate-300 hover:-translate-y-1">
      <div>
        {/* Card Header & Badges */}
        <div className="p-5 pb-3">
          <div className="flex items-start justify-between gap-3 mb-3">
            {/* Category Icon Badge */}
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 shrink-0"
              style={{
                backgroundColor: `${category.color || '#0d9488'}15`,
                color: category.color || '#0d9488'
              }}
            >
              <CategoryIcon name={category.icon} className="w-5 h-5" color={category.color} />
            </div>

            <div className="flex flex-wrap items-center gap-1.5 justify-end">
              {service.isDemo && (
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200">
                  Demo
                </span>
              )}
              {service.emergencyAvailable && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse"></span>
                  24/7 Emergency
                </span>
              )}
              {service.verified && (
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  Verified
                </span>
              )}
            </div>
          </div>

          {/* Category Name pill */}
          <span
            className="text-[11px] font-bold tracking-wider uppercase px-2 py-0.5 rounded"
            style={{
              backgroundColor: `${category.color || '#0d9488'}10`,
              color: category.color || '#0d9488'
            }}
          >
            {category.name}
          </span>

          {/* Service Name */}
          <h3 className="text-base font-bold text-slate-900 mt-2 mb-2 line-clamp-1 group-hover:text-teal-700 transition">
            <Link to={`/services/${service.id}`}>
              {service.name}
            </Link>
          </h3>

          {/* Address & Locality */}
          <div className="space-y-1.5 text-xs text-slate-600">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <span className="line-clamp-1">{service.address}</span>
            </div>
            <div className="flex items-center gap-2 font-medium text-slate-700 pl-6">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-slate-300"></span>
              <span>{service.locality}</span>
            </div>
          </div>
        </div>

        {/* Operational Highlights & Accessibility */}
        <div className="px-5 py-2.5 bg-slate-50/70 border-y border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1.5 text-slate-700">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span className="truncate font-medium">{service.openingHours || 'Hours not listed'}</span>
          </div>

          <div className="flex items-center gap-2">
            {service.accessibilityAvailable ? (
              <span
                className="inline-flex items-center gap-1 text-[11px] font-medium text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200/60"
                title="Wheelchair accessible entrance / amenities"
              >
                <Accessibility className="w-3.5 h-3.5" />
                Accessible
              </span>
            ) : (
              <span className="text-[11px] text-slate-400" title="Accessibility not confirmed">
                Standard Access
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Card Footer Actions */}
      <div className="p-4 bg-white flex items-center justify-between gap-2">
        {service.phone ? (
          <a
            href={`tel:${service.phone.replace(/[^0-9+]/g, '')}`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-teal-600 px-3 py-2 rounded-lg hover:bg-slate-50 border border-slate-200 transition"
          >
            <Phone className="w-3.5 h-3.5 text-teal-600" />
            <span>Call</span>
          </a>
        ) : (
          <span className="text-xs text-slate-400 italic">No direct phone</span>
        )}

        <div className="flex items-center gap-2">
          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-900 px-2.5 py-2 rounded-lg hover:bg-slate-100 transition"
            title="Open directions in maps"
          >
            <Navigation className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Directions</span>
          </a>

          <Link
            to={`/services/${service.id}`}
            className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-sm transition active:scale-95 group/btn"
          >
            <span>Details</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
