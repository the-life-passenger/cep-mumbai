import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import {
  MapPin,
  Menu,
  X,
  Compass,
  Search,
  AlertCircle,
  ClipboardList,
  MessageSquare,
  BarChart3,
  Info,
  ChevronRight
} from 'lucide-react';

const NAV_LINKS = [
  { name: 'Home', path: '/' },
  { name: 'Services', path: '/services' },
  { name: 'Map', path: '/map' },
  { name: 'Emergency', path: '/emergency', badge: '24/7' },
  { name: 'Survey', path: '/survey' },
  { name: 'Feedback', path: '/feedback' },
  { name: 'Project Data', path: '/project-data' },
  { name: 'About', path: '/about' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200/80 py-2.5'
          : 'bg-white border-b border-slate-100 py-3.5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group focus:outline-none focus:ring-2 focus:ring-teal-500 rounded-lg p-1">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-900 to-navy-800 text-teal-400 flex items-center justify-center shadow-subtle group-hover:scale-105 transition-transform duration-200">
              <MapPin className="w-5 h-5 text-teal-400" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-bold tracking-tight text-slate-900 font-sans">
                  MyLocal<span className="text-teal-600">.</span>
                </span>
                <span className="text-[10px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                  CEP
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block leading-none mt-0.5">
                Essential Public Services Directory
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map(link => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-1.5 ${
                    isActive
                      ? 'text-teal-700 bg-teal-50/80 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`
                }
              >
                {link.name}
                {link.badge && (
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded-full bg-rose-100 text-rose-700">
                    {link.badge}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Right CTA & Mobile Toggle */}
          <div className="flex items-center gap-3">
            <Link
              to="/services"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold shadow-sm hover:shadow transition-all duration-200 active:scale-95"
            >
              <Search className="w-4 h-4 text-teal-400" />
              <span>Explore Services</span>
            </Link>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-700 hover:text-slate-900 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Slide-Out Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[65px] bottom-0 bg-slate-900/40 backdrop-blur-sm z-30 transition-opacity">
          <div className="bg-white border-b border-slate-200 px-4 pt-3 pb-6 shadow-xl max-h-[85vh] overflow-y-auto">
            <div className="space-y-1">
              {NAV_LINKS.map(link => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-4 py-3 rounded-xl text-base font-medium transition ${
                      isActive
                        ? 'text-teal-700 bg-teal-50 font-semibold'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`
                  }
                >
                  <span className="flex items-center gap-2">
                    {link.name}
                    {link.badge && (
                      <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-rose-100 text-rose-700">
                        {link.badge}
                      </span>
                    )}
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </NavLink>
              ))}
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100 space-y-2">
              <Link
                to="/services"
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-900 text-white font-semibold text-sm shadow hover:bg-slate-800 transition"
              >
                <Search className="w-4 h-4 text-teal-400" />
                Explore Service Directory
              </Link>
              <Link
                to="/map"
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-teal-50 text-teal-800 font-semibold text-sm border border-teal-200 hover:bg-teal-100 transition"
              >
                <Compass className="w-4 h-4 text-teal-600" />
                Open Interactive Map
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
