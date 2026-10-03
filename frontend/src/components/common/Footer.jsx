import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ShieldCheck, Heart, ExternalLink, Lock } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand & Project Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-teal-500/20 text-teal-400 border border-teal-500/30 flex items-center justify-center">
                <MapPin className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                MyLocal<span className="text-teal-400">.</span> Services
              </span>
            </div>
            <p className="text-slate-300 font-medium">
              Find Essential Services Around You
            </p>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Making essential community information easier to find. A University of Mumbai B.Sc. Computer Science Semester V Community Engagement Project (CEP) mapping public civic infrastructure across local wards.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-teal-400" />
              <span>Non-commercial civic technology initiative</span>
            </div>
          </div>

          {/* Directory Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200">
              Community Directory
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/services" className="hover:text-teal-400 transition">
                  Browse All Services
                </Link>
              </li>
              <li>
                <Link to="/map" className="hover:text-teal-400 transition">
                  Interactive GIS Map
                </Link>
              </li>
              <li>
                <Link to="/emergency" className="hover:text-rose-400 text-rose-300/90 transition flex items-center gap-1.5">
                  Emergency 24/7
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                </Link>
              </li>
              <li>
                <Link to="/services?categoryId=cat-hospital" className="hover:text-teal-400 transition">
                  Hospitals & Clinics
                </Link>
              </li>
              <li>
                <Link to="/services?categoryId=cat-pharmacy" className="hover:text-teal-400 transition">
                  Pharmacies & Chemist
                </Link>
              </li>
            </ul>
          </div>

          {/* Academic & Engagement */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200">
              Community & CEP
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/survey" className="hover:text-teal-400 transition">
                  Community Survey
                </Link>
              </li>
              <li>
                <Link to="/feedback" className="hover:text-teal-400 transition">
                  Community Feedback
                </Link>
              </li>
              <li>
                <Link to="/project-data" className="hover:text-teal-400 transition">
                  Survey Findings & Data
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-teal-400 transition">
                  Project Methodology
                </Link>
              </li>
            </ul>
          </div>

          {/* Institutional Context */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200">
              Academic Project
            </h4>
            <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs text-slate-300 space-y-1.5">
              <p className="font-semibold text-white">University of Mumbai</p>
              <p>B.Sc. Computer Science</p>
              <p className="text-slate-400">Semester V • Course: CEP</p>
              <p className="text-[11px] text-teal-300 pt-1">Topic: Mapping Essential Services</p>
            </div>
            <div className="pt-1">
              <Link
                to="/admin/login"
                className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Project Admin Portal</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 MyLocal Services. University of Mumbai B.Sc. CS Community Engagement Project.</p>
          <div className="flex items-center gap-6">
            <Link to="/about#privacy" className="hover:text-slate-400 transition">Privacy & Ethics</Link>
            <Link to="/about#contact" className="hover:text-slate-400 transition">Contact Project Team</Link>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">Open-Source Civic Tech</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
