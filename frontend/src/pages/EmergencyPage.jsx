import React, { useState, useEffect } from 'react';
import {
  Phone,
  ShieldAlert,
  Ambulance,
  Flame,
  Hospital,
  AlertTriangle,
  HeartPulse,
  Navigation,
  ExternalLink,
  CheckCircle2,
  Clock,
  ArrowRight
} from 'lucide-react';
import { api } from '../services/api';
import { Link } from 'react-router-dom';

const NATIONAL_HELPLINES = [
  {
    name: 'National Emergency Helpline',
    number: '112',
    category: 'All Emergencies',
    description: 'Unified single emergency number across India for Police, Fire, Ambulance & Disaster Response.',
    icon: ShieldAlert,
    badge: 'Toll Free / 24x7'
  },
  {
    name: 'Ambulance & Trauma Medical Dispatch',
    number: '108',
    category: 'Medical Emergency',
    description: 'Maharashtra Emergency Medical Services (MEMS) with GPS-tracked Advance Life Support ambulances.',
    icon: Ambulance,
    badge: 'Toll Free / 24x7'
  },
  {
    name: 'Mumbai City Police Control Room',
    number: '100',
    category: 'Law Enforcement',
    description: 'Immediate police patrol dispatch and local beat chowki mobilization for civic distress.',
    icon: ShieldAlert,
    badge: '24x7 Control'
  },
  {
    name: 'Mumbai Fire Brigade Command',
    number: '101',
    category: 'Fire & Rescue',
    description: 'Urgent response to fires, building collapse, chemical hazards, and water rescues.',
    icon: Flame,
    badge: '24x7 Control'
  },
  {
    name: 'Nirbhaya Women Helpline',
    number: '1091',
    category: 'Women Safety',
    description: 'Round-the-clock dedicated assistance, distress rescue, and counseling support.',
    icon: HeartPulse,
    badge: 'Confidential'
  },
  {
    name: 'BMC Disaster Control Room',
    number: '1916',
    category: 'Municipal Civic Disaster',
    description: 'Municipal Corporation of Greater Mumbai hotline for monsoons, waterlogging, fallen trees & landslides.',
    icon: AlertTriangle,
    badge: 'Civic Help'
  }
];

export default function EmergencyPage() {
  const [emergencyServices, setEmergencyServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadEmergencyServices() {
      try {
        const data = await api.getServices({ emergencyAvailable: true });
        setEmergencyServices(data);
      } catch (err) {
        console.error('Failed to load emergency services:', err);
      } finally {
        setLoading(false);
      }
    }
    loadEmergencyServices();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
      {/* 1. Header & Verification Advisory */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-800 text-xs font-bold uppercase tracking-wider border border-rose-200">
          <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse"></span>
          Emergency Rapid Assistance
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight font-sans">
          Essential Emergency Helplines
        </h1>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          Critical contact numbers for urgent police, fire, medical trauma, and civic disaster dispatch in Mumbai.
        </p>

        {/* Clear Local Verification Advisory Note */}
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/80 text-amber-900 text-xs sm:text-sm text-left flex items-start gap-3 mt-4">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold">Important Civic Advisory:</p>
            <p className="text-amber-800 leading-relaxed">
              In an immediate life-threatening crisis, prioritize dialing <strong>112</strong> or <strong>108</strong> directly from any mobile or landline. Information in this community directory is gathered during student field research; always cross-verify localized hospital casualty desks for real-time bed or oxygen availability.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Primary Helplines Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {NATIONAL_HELPLINES.map((helpline) => {
          const Icon = helpline.icon;
          return (
            <div
              key={helpline.number}
              className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-100">
                    {helpline.badge}
                  </span>
                </div>

                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  {helpline.category}
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-1 mb-2">
                  {helpline.name}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-6">
                  {helpline.description}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                <div className="font-mono text-2xl font-black text-slate-950 tracking-tight">
                  {helpline.number}
                </div>

                <a
                  href={`tel:${helpline.number}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs shadow-sm transition active:scale-95"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Now</span>
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Cataloged 24/7 Local Emergency Facilities */}
      <div className="space-y-6 pt-6 border-t border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full">
              Community Mapped
            </span>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1 font-sans">
              Mapped 24/7 Emergency Facilities
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Public hospitals with casualty wards, 24-hour pharmacies, and regional police stations in your locality.
            </p>
          </div>
          <Link
            to="/services?emergencyAvailable=true"
            className="text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1"
          >
            <span>View All Emergency Services</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {emergencyServices.length === 0 ? (
          <p className="text-xs text-slate-400 italic">No emergency facilities loaded.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {emergencyServices.map((service) => (
              <div
                key={service.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-2 py-0.5 rounded">
                      24/7 Casualty
                    </span>
                    <span className="text-slate-500">{service.locality}</span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900">
                    <Link to={`/services/${service.id}`} className="hover:text-teal-700 transition">
                      {service.name}
                    </Link>
                  </h4>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                    {service.address}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  {service.phone && (
                    <a
                      href={`tel:${service.phone.replace(/[^0-9+]/g, '')}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-slate-800 hover:text-teal-700"
                    >
                      <Phone className="w-3.5 h-3.5 text-teal-600" />
                      <span>{service.phone}</span>
                    </a>
                  )}

                  <Link
                    to={`/services/${service.id}`}
                    className="text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 px-3 py-1.5 rounded-lg transition ml-auto"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
