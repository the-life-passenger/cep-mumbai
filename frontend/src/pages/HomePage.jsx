import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  Compass,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Phone,
  Clock,
  MapPin,
  Sparkles,
  Layers,
  HeartHandshake,
  Users,
  Building2,
  Hospital,
  Pill,
  ShieldAlert,
  ArrowUpRight
} from 'lucide-react';
import { api } from '../services/api';
import { CategoryIcon } from '../utils/iconMap';
import ServiceCard from '../components/service/ServiceCard';
import { ServiceCardSkeleton } from '../components/common/Skeleton';

export default function HomePage() {
  const [categories, setCategories] = useState([]);
  const [featuredServices, setFeaturedServices] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [content, setContent] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    async function loadHomeData() {
      try {
        const [catsRes, servsRes, statsRes, contentRes] = await Promise.all([
          api.getCategories(),
          api.getServices({ verified: true }),
          api.getServiceStats(),
          api.getContent()
        ]);
        setCategories(catsRes);
        setFeaturedServices(servsRes.slice(0, 3));
        setStats(statsRes);
        setContent(contentRes);
      } catch (err) {
        console.error('Error loading home data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadHomeData();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/services?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/services');
    }
  };

  const categoryMap = categories.reduce((acc, cat) => {
    acc[cat.id] = cat;
    return acc;
  }, {});

  return (
    <div className="space-y-16 sm:space-y-24 pb-16 overflow-hidden">
      {/* 1. HERO SECTION */}
      <section className="relative pt-6 sm:pt-12 lg:pt-16 pb-12 bg-gradient-to-b from-slate-100/60 via-white to-slate-50 border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Hero Content */}
            <div className="lg:col-span-7 space-y-6 sm:space-y-8 text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 text-teal-300 text-xs font-semibold tracking-wide uppercase shadow-subtle">
                <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                <span>{content.heroBadge || 'COMMUNITY SERVICE DIRECTORY'}</span>
              </div>

              {/* Main Heading */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-950 font-sans leading-[1.15]">
                {content.heroHeading ? (
                  content.heroHeading
                ) : (
                  <>
                    Essential Services.
                    <br />
                    <span className="text-teal-700">Right Where You Need Them.</span>
                  </>
                )}
              </h1>

              {/* Description */}
              <p className="text-lg sm:text-xl text-slate-600 font-normal leading-relaxed max-w-2xl mx-auto lg:mx-0">
                {content.heroDescription ||
                  'Discover essential public services in your locality through a simple, accessible and community-powered digital directory.'}
              </p>

              {/* Quick Search Bar */}
              <form
                onSubmit={handleSearchSubmit}
                className="max-w-xl mx-auto lg:mx-0 relative flex items-center shadow-card rounded-2xl bg-white p-2 border border-slate-200 focus-within:ring-2 focus-within:ring-teal-500 focus-within:border-teal-500 transition-all"
              >
                <Search className="w-5 h-5 text-slate-400 ml-3 shrink-0" />
                <input
                  type="text"
                  placeholder="Search hospitals, chemist, police, toilets, localities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm sm:text-base text-slate-900 placeholder-slate-400 bg-transparent focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm transition active:scale-95 shrink-0 shadow-sm"
                >
                  Search
                </button>
              </form>

              {/* Hero Action Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to="/services"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-semibold text-base shadow-sm hover:shadow transition-all duration-200 active:scale-95 group"
                >
                  <span>Explore Services</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>

                <Link
                  to="/map"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-semibold text-base border border-slate-200 shadow-subtle hover:border-slate-300 transition-all duration-200 active:scale-95"
                >
                  <Compass className="w-4 h-4 text-teal-600" />
                  <span>View Interactive Map</span>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-500">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Locally Verified Records</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-teal-600" />
                  <span>Mumbai University CEP Project</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                  <span>24/7 Emergency Helplines</span>
                </div>
              </div>
            </div>

            {/* Right Map-Inspired Visual with Floating Service Cards */}
            <div className="lg:col-span-5 relative">
              <div className="relative w-full aspect-square max-w-[480px] mx-auto rounded-3xl bg-gradient-to-tr from-slate-900 via-navy-900 to-slate-800 p-6 shadow-2xl overflow-hidden border border-slate-700/50">
                {/* Background Map Grid Pattern */}
                <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#14b8a6_1px,transparent_1px)] [background-size:18px_18px]" />
                
                {/* Decorative Map Ring */}
                <div className="absolute -top-12 -right-12 w-64 h-64 rounded-full border border-teal-500/20 animate-pulse pointer-events-none" />
                <div className="absolute -bottom-8 -left-8 w-48 h-48 rounded-full border border-teal-500/10 pointer-events-none" />

                {/* Central Civic Map Beacon */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                  <div className="w-16 h-16 rounded-full bg-teal-500/20 border border-teal-400/40 flex items-center justify-center mx-auto mb-2 backdrop-blur-sm">
                    <Compass className="w-8 h-8 text-teal-300 animate-spin-slow" />
                  </div>
                  <span className="text-[11px] font-mono tracking-widest uppercase text-teal-300/80">
                    MUMBAI METRO CIVIC GRID
                  </span>
                </div>

                {/* FLOATING CARD 1: Hospital */}
                <div className="absolute top-6 left-6 right-16 bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-float border border-white/60 animate-float-slow transition hover:scale-105 cursor-pointer"
                  onClick={() => navigate('/services?categoryId=cat-hospital')}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                      <Hospital className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-1.5 py-0.2 rounded">
                          24/7 Trauma Care
                        </span>
                        <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 truncate mt-0.5">
                        KEM Municipal General Hospital
                      </h4>
                      <p className="text-[11px] text-slate-500 truncate">Parel, Mumbai • Casualties Open</p>
                    </div>
                  </div>
                </div>

                {/* FLOATING CARD 2: Pharmacy */}
                <div className="absolute top-1/2 -translate-y-1/2 right-4 left-20 bg-white/95 backdrop-blur-md rounded-2xl p-3.5 shadow-float border border-white/60 animate-float-delayed transition hover:scale-105 cursor-pointer"
                  onClick={() => navigate('/services?categoryId=cat-pharmacy')}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                      <Pill className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded">
                        Generic Chemist
                      </span>
                      <h4 className="text-xs font-bold text-slate-900 truncate mt-0.5">
                        Jan Aushadhi Kendra
                      </h4>
                      <p className="text-[11px] text-slate-500 truncate">Dadar East • 50-90% Discount</p>
                    </div>
                  </div>
                </div>

                {/* FLOATING CARD 3: Police Station */}
                <div className="absolute bottom-6 left-8 right-12 bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-float border border-white/60 animate-float-slow transition hover:scale-105 cursor-pointer"
                  onClick={() => navigate('/services?categoryId=cat-police')}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                      <ShieldAlert className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded">
                          Nirbhaya Helpdesk
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 truncate mt-0.5">
                        Dadar Police Station & Chowki
                      </h4>
                      <p className="text-[11px] text-slate-500 truncate">Dadasaheb Phalke Marg • 24/7</p>
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. STATS STRIP */}
      {stats && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-white rounded-2xl border border-slate-200/80 shadow-sm">
            <div className="p-4 text-center border-r border-slate-100 last:border-r-0">
              <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-sans">
                {stats.total}+
              </p>
              <p className="text-xs font-medium text-slate-500 mt-1 uppercase tracking-wider">
                Services Cataloged
              </p>
            </div>
            <div className="p-4 text-center border-r border-slate-100 last:border-r-0">
              <p className="text-3xl sm:text-4xl font-extrabold text-teal-600 tracking-tight font-sans">
                {stats.verified}
              </p>
              <p className="text-xs font-medium text-slate-500 mt-1 uppercase tracking-wider">
                Verified Facilities
              </p>
            </div>
            <div className="p-4 text-center border-r border-slate-100 last:border-r-0">
              <p className="text-3xl sm:text-4xl font-extrabold text-rose-600 tracking-tight font-sans">
                {stats.emergency}
              </p>
              <p className="text-xs font-medium text-slate-500 mt-1 uppercase tracking-wider">
                24/7 Emergency Hubs
              </p>
            </div>
            <div className="p-4 text-center">
              <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-sans">
                {stats.byLocality?.length || 5}
              </p>
              <p className="text-xs font-medium text-slate-500 mt-1 uppercase tracking-wider">
                Localities Surveyed
              </p>
            </div>
          </div>
        </section>
      )}

      {/* 3. EXPLORE ESSENTIAL SERVICES (CATEGORIES GRID) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <span className="text-xs font-bold tracking-wider uppercase text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200/50">
            Categorized Civic Directory
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-sans">
            Explore Essential Services
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Find the exact public infrastructure you need, from municipal healthcare and generic pharmacies to law enforcement and sanitation blocks.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/services?categoryId=${cat.id}`}
              className="group bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between hover:border-slate-300 hover:-translate-y-1 relative overflow-hidden"
            >
              {/* Category Color Accent Strip */}
              <div
                className="absolute top-0 left-0 right-0 h-1 transition-all group-hover:h-1.5"
                style={{ backgroundColor: cat.color || '#0d9488' }}
              />

              <div>
                <div className="flex items-center justify-between mb-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 group-hover:rotate-3 duration-200"
                    style={{
                      backgroundColor: `${cat.color || '#0d9488'}15`,
                      color: cat.color || '#0d9488'
                    }}
                  >
                    <CategoryIcon name={cat.icon} className="w-6 h-6" color={cat.color} />
                  </div>
                  <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                    {cat.count || 0} {cat.count === 1 ? 'place' : 'places'}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 group-hover:text-teal-700 transition">
                  {cat.name}
                </h3>
                <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
                  {cat.description}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-700 group-hover:text-teal-700 transition">
                <span>Browse Category</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. FEATURED / VERIFIED DIRECTORY PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold tracking-wider uppercase text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200/50">
              Community Ground Survey
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-2 font-sans">
              Featured Verified Public Facilities
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Key civic institutions cataloged across local Mumbai wards with confirmed accessibility notes.
            </p>
          </div>

          <Link
            to="/services"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-teal-700 hover:text-teal-800 transition"
          >
            <span>View All Services</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ServiceCardSkeleton />
            <ServiceCardSkeleton />
            <ServiceCardSkeleton />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredServices.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                categoryMap={categoryMap}
              />
            ))}
          </div>
        )}
      </section>

      {/* 5. COMMUNITY SURVEY CALLOUT BANNER (CEP CORE REQUIREMENT) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-navy-900 to-teal-950 text-white p-8 sm:p-12 shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs font-semibold uppercase tracking-wider">
              <HeartHandshake className="w-3.5 h-3.5" />
              Community Engagement Survey
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight font-sans">
              Help us identify service deficits in your neighborhood
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Are there public toilets lacking wheelchair ramps? Is your local night pharmacy missing accurate timings? Share your everyday observations to strengthen our civic engagement research report.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link
                to="/survey"
                className="px-6 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-sm shadow-md transition active:scale-95 flex items-center gap-2"
              >
                <span>Take 2-Minute Survey</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/project-data"
                className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/20 transition backdrop-blur-sm"
              >
                View Survey Findings
              </Link>
            </div>
          </div>

          {/* Decorative Background Element */}
          <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-10 bg-[radial-gradient(#14b8a6_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none hidden md:block" />
        </div>
      </section>

      {/* 6. ACADEMIC SYLLABUS CREDITS & ETHICS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-100/70 rounded-2xl border border-slate-200/80 p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-teal-700" />
              <h3 className="font-bold text-slate-900 text-base">
                University of Mumbai • B.Sc. Computer Science Semester V
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              <strong>Course:</strong> Community Engagement Project (CEP) • <strong>Topic:</strong> Mapping Essential Public Services. Developed by B.Sc. CS students to digitize public infrastructure, promote civic transparency, and deliver a practical, accessible directory for Mumbai residents.
            </p>
          </div>
          <Link
            to="/about"
            className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 text-xs font-semibold shadow-sm transition"
          >
            <span>Learn More About CEP</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-500" />
          </Link>
        </div>
      </section>
    </div>
  );
}
