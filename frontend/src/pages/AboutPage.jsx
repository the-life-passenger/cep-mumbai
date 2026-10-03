import React, { useState, useEffect } from 'react';
import {
  Building2,
  BookOpen,
  Target,
  AlertCircle,
  CheckCircle2,
  Users,
  Compass,
  Code2,
  GraduationCap,
  ShieldCheck,
  MapPin,
  ExternalLink,
  Cpu
} from 'lucide-react';
import { api } from '../services/api';

const METHODOLOGY_STEPS = [
  { step: 1, title: 'Locality Selection', desc: 'Demarcate boundary wards in Mumbai (e.g. Dadar, Parel, Bandra, Kurla) balancing residential density and transit accessibility.' },
  { step: 2, title: 'Field Reconnaissance', desc: 'Conduct in-person observational walkthroughs of arterial roads, market corridors, and transit hubs.' },
  { step: 3, title: 'Identification of Essential Services', desc: 'Locate hospitals, 24/7 pharmacies, police stations, public sanitation units, municipal schools, and civic offices.' },
  { step: 4, title: 'Data Collection & Verification', desc: 'Capture operational hours, emergency trauma availability, wheelchair ramps, and official telephone numbers.' },
  { step: 5, title: 'Community Survey', desc: 'Deploy structured resident questionnaires to identify common public service bottlenecks and accessibility deficits.' },
  { step: 6, title: 'Data Auditing & Ground Verification', desc: 'Spot-check survey entries against municipal corporation ward listings and physical notice boards.' },
  { step: 7, title: 'Digital Schema Architecture', desc: 'Design normalized data models in MongoDB with geolocation coordinates and accessibility tags.' },
  { step: 8, title: 'Web Application Development', desc: 'Build an accessible, high-performance web platform and GIS map using React, Vite, Leaflet, and Express.' },
  { step: 9, title: 'Spatial & Survey Analytics', desc: 'Analyze spatial clustering of emergency services and community feedback using Recharts statistical visualizations.' },
  { step: 10, title: 'Findings & Civic Recommendations', desc: 'Compile a structured academic CEP report presenting policy suggestions for urban civic authorities.' }
];

export default function AboutPage() {
  const [content, setContent] = useState({});

  useEffect(() => {
    async function loadContent() {
      try {
        const data = await api.getContent();
        setContent(data);
      } catch (err) {
        console.error('Failed to load content:', err);
      }
    }
    loadContent();
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16">
      {/* 1. Header Banner */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 text-teal-400 text-xs font-semibold uppercase tracking-wider shadow-subtle">
          <GraduationCap className="w-4 h-4" />
          <span>Academic Project Overview</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight font-sans">
          Mapping Essential Public Services
        </h1>
        <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          University of Mumbai • B.Sc. Computer Science Semester V
          <br />
          <strong>Community Engagement Project (CEP)</strong>
        </p>
      </div>

      {/* 2. Problem Statement & Objective Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Problem Statement */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-8 shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 font-sans">Problem Statement</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            {content.aboutProblem ||
              'Residents, daily commuters, and visitors frequently experience significant friction when seeking accurate, real-time information regarding essential civic infrastructure in their neighborhoods. Crucial details—such as whether a chemist is genuinely open 24 hours, whether a municipal public toilet has accessible wheelchair ramps, or which beat chowki has jurisdiction—are fragmented across outdated portals, poorly indexed, or completely undocumented digitally.'}
          </p>
        </div>

        {/* Objective */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-8 shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center">
            <Target className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 font-sans">Project Objective</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            {content.aboutObjective ||
              'To systematically survey, geocode, and digitally document essential public facilities across selected localities; to make this information publicly accessible via a fast, mobile-friendly interactive directory and GIS map; and to analyze community survey data to identify localized civic accessibility deficits for academic inquiry and municipal recommendation.'}
          </p>
        </div>
      </div>

      {/* 3. Ethical Academic Disclaimer */}
      <div className="rounded-3xl bg-slate-900 text-white p-8 sm:p-10 shadow-xl border border-slate-800 space-y-3">
        <div className="flex items-center gap-2 text-teal-400 font-bold text-sm">
          <ShieldCheck className="w-5 h-5" />
          <span>Academic Fieldwork & Ethics Notice</span>
        </div>
        <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
          Transparency in Community Data Collection
        </h3>
        <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
          Per Mumbai University CEP guidelines, all demonstration records currently in this directory are explicitly marked with a <span className="text-amber-400 font-mono font-bold">[DEMO DATA]</span> tag. Actual field visits, direct geolocation audits, and resident survey questionnaires will be ingested sequentially by the student team without presenting fabricated research findings as genuine data.
        </p>
      </div>

      {/* 4. Ten-Step CEP Methodology */}
      <div className="space-y-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200/50">
            Syllabus Workflow
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-2 font-sans">
            10-Step CEP Research Methodology
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Structured civic-tech framework adopted from the University of Mumbai Semester V syllabus.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {METHODOLOGY_STEPS.map((m) => (
            <div
              key={m.step}
              className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm flex items-start gap-4 hover:border-slate-300 transition"
            >
              <div className="w-8 h-8 rounded-xl bg-slate-900 text-teal-400 flex items-center justify-center font-mono font-bold text-xs shrink-0">
                {m.step}
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-slate-900">{m.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{m.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Technology Stack & Civic Architecture */}
      <div className="bg-slate-50 rounded-3xl border border-slate-200 p-8 space-y-6">
        <div className="flex items-center gap-2">
          <Cpu className="w-5 h-5 text-teal-700" />
          <h3 className="text-lg font-bold text-slate-900 font-sans">Technology & Architecture</h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-subtle space-y-1">
            <span className="font-bold text-slate-900 block">Frontend</span>
            <span className="text-slate-500">React 18 + Vite</span>
            <span className="text-teal-700 block font-medium">Tailwind CSS</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-subtle space-y-1">
            <span className="font-bold text-slate-900 block">Backend</span>
            <span className="text-slate-500">Node.js + Express</span>
            <span className="text-teal-700 block font-medium">RESTful API Architecture</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-subtle space-y-1">
            <span className="font-bold text-slate-900 block">Database</span>
            <span className="text-slate-500">MongoDB + Mongoose</span>
            <span className="text-teal-700 block font-medium">Persistent Fail-safe Engine</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-subtle space-y-1">
            <span className="font-bold text-slate-900 block">Geospatial Maps</span>
            <span className="text-slate-500">Leaflet GIS Engine</span>
            <span className="text-teal-700 block font-medium">OpenStreetMap (Zero Paid API)</span>
          </div>
        </div>
      </div>

      {/* 6. Academic Team & Attribution */}
      <div id="contact" className="bg-white rounded-3xl border border-slate-200/80 p-8 shadow-sm space-y-4">
        <h3 className="text-lg font-bold text-slate-900 font-sans">
          Project Team & Academic Contact
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          This community engagement portal is maintained by students of the <strong>Department of Computer Science</strong>. Inquiries regarding data sharing, ward surveys, or methodology can be addressed to the project administrator.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-slate-400 block font-medium">Email:</span>
            <span className="text-slate-900 font-bold">{content.contactEmail || 'cep.community@university-project.edu'}</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-slate-400 block font-medium">Location:</span>
            <span className="text-slate-900 font-bold">{content.contactLocality || 'Mumbai, Maharashtra'}</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-slate-400 block font-medium">Affiliation:</span>
            <span className="text-slate-900 font-bold">University of Mumbai</span>
          </div>
        </div>
      </div>
    </div>
  );
}
