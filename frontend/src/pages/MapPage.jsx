import React, { useState, useEffect } from 'react';
import {
  Search,
  Compass,
  Crosshair,
  Filter,
  MapPin,
  Phone,
  Navigation,
  CheckCircle2,
  Clock,
  Layers,
  ChevronRight,
  List,
  Map as MapIcon,
  X
} from 'lucide-react';
import { api } from '../services/api';
import InteractiveMap from '../components/map/InteractiveMap';
import { CategoryIcon } from '../utils/iconMap';
import { useDebounce } from '../hooks/useDebounce';
import { Link } from 'react-router-dom';

export default function MapPage() {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [emergencyOnly, setEmergencyOnly] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [mapCenter, setMapCenter] = useState([19.0178, 72.8478]); // Central Mumbai (Dadar)
  const [userLocating, setUserLocating] = useState(false);

  // Mobile tab state: 'map' | 'list'
  const [mobileTab, setMobileTab] = useState('map');

  useEffect(() => {
    async function loadData() {
      try {
        const [catsRes, servsRes] = await Promise.all([
          api.getCategories(),
          api.getServices()
        ]);
        setCategories(catsRes);
        setServices(servsRes);
      } catch (err) {
        console.error('Failed to load map data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Filter services locally for instantaneous map response
  const filteredServices = services.filter((s) => {
    if (selectedCategory !== 'all' && s.categoryId !== selectedCategory) return false;
    if (emergencyOnly && !s.emergencyAvailable) return false;
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      return (
        s.name.toLowerCase().includes(q) ||
        s.locality.toLowerCase().includes(q) ||
        s.address.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setUserLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setMapCenter([pos.coords.latitude, pos.coords.longitude]);
        setUserLocating(false);
      },
      (err) => {
        console.warn('Geolocation error:', err.message);
        setUserLocating(false);
        alert('Could not determine your current location. Please verify device permissions.');
      },
      { timeout: 10000 }
    );
  };

  const categoryMap = categories.reduce((acc, cat) => {
    acc[cat.id] = cat;
    return acc;
  }, {});

  return (
    <div className="flex flex-col h-[calc(100vh-65px)] overflow-hidden bg-slate-100">
      {/* Mobile Tab Switcher */}
      <div className="lg:hidden flex items-center justify-around bg-white border-b border-slate-200 px-4 py-2 shrink-0 z-20">
        <button
          onClick={() => setMobileTab('map')}
          className={`flex items-center gap-1.5 py-1.5 px-4 rounded-xl text-xs font-bold transition ${
            mobileTab === 'map'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <MapIcon className="w-4 h-4" />
          <span>Interactive Map</span>
        </button>
        <button
          onClick={() => setMobileTab('list')}
          className={`flex items-center gap-1.5 py-1.5 px-4 rounded-xl text-xs font-bold transition ${
            mobileTab === 'list'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <List className="w-4 h-4" />
          <span>Services List ({filteredServices.length})</span>
        </button>
      </div>

      {/* Main Split Layout */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        {/* LEFT COLUMN: Controls & Scrollable Service List */}
        <div
          className={`w-full lg:w-[420px] xl:w-[460px] bg-white border-r border-slate-200 flex flex-col shrink-0 z-10 transition-all ${
            mobileTab === 'map' ? 'hidden lg:flex' : 'flex'
          }`}
        >
          {/* Search & Filter Header */}
          <div className="p-4 border-b border-slate-200 bg-white space-y-3 shrink-0 shadow-subtle">
            <div className="relative flex items-center rounded-xl bg-slate-50 border border-slate-200 px-3 py-1.5 focus-within:ring-2 focus-within:ring-teal-500 focus-within:bg-white transition">
              <Search className="w-4 h-4 text-slate-400 shrink-0 mr-2" />
              <input
                type="text"
                placeholder="Search map by name, locality..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-transparent text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
              />
              {search && (
                <button onClick={() => setSearch('')} className="p-1 text-slate-400 hover:text-slate-600">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Category Filter Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-3 py-1 rounded-lg shrink-0 font-medium transition ${
                  selectedCategory === 'all'
                    ? 'bg-slate-900 text-white font-semibold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                All
              </button>
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCategory(c.id)}
                  className={`px-2.5 py-1 rounded-lg shrink-0 font-medium transition flex items-center gap-1.5 ${
                    selectedCategory === c.id
                      ? 'bg-teal-700 text-white font-semibold shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <CategoryIcon name={c.icon} className="w-3.5 h-3.5" />
                  <span>{c.name.split(' ')[0]}</span>
                </button>
              ))}
            </div>

            {/* Emergency Toggle & Locate Me */}
            <div className="flex items-center justify-between gap-2 pt-1 text-xs">
              <button
                onClick={() => setEmergencyOnly(!emergencyOnly)}
                className={`px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1.5 border transition ${
                  emergencyOnly
                    ? 'bg-rose-50 border-rose-300 text-rose-700'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${emergencyOnly ? 'bg-rose-600 animate-pulse' : 'bg-slate-400'}`}></span>
                <span>24/7 Emergency</span>
              </button>

              <button
                onClick={handleLocateMe}
                disabled={userLocating}
                className="inline-flex items-center gap-1 text-slate-700 hover:text-teal-700 font-semibold px-2 py-1 rounded-lg bg-slate-100 hover:bg-teal-50 border border-slate-200 transition"
              >
                <Crosshair className={`w-3.5 h-3.5 ${userLocating ? 'animate-spin text-teal-600' : 'text-slate-600'}`} />
                <span>{userLocating ? 'Locating...' : 'Locate Me'}</span>
              </button>
            </div>
          </div>

          {/* Service List Scrollable */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 divide-y divide-slate-100">
            {filteredServices.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-500">
                <Compass className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="font-semibold text-slate-700">No matching map services</p>
                <p className="mt-1">Try resetting search or category filter</p>
              </div>
            ) : (
              filteredServices.map((service) => {
                const isSelected = selectedService && selectedService.id === service.id;
                const cat = categoryMap[service.categoryId];
                return (
                  <div
                    key={service.id}
                    onClick={() => {
                      setSelectedService(service);
                      setMapCenter([service.latitude, service.longitude]);
                      if (window.innerWidth < 1024) {
                        setMobileTab('map');
                      }
                    }}
                    className={`pt-3 first:pt-0 p-3 rounded-2xl cursor-pointer transition-all duration-200 ${
                      isSelected
                        ? 'bg-teal-50/80 border border-teal-200 shadow-sm'
                        : 'hover:bg-slate-50 border border-transparent'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 mb-1">
                          <span
                            className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded"
                            style={{
                              backgroundColor: `${cat?.color || '#0d9488'}15`,
                              color: cat?.color || '#0d9488'
                            }}
                          >
                            {cat?.name || 'Public Service'}
                          </span>
                          {service.emergencyAvailable && (
                            <span className="text-[10px] font-bold uppercase text-rose-700 bg-rose-50 px-1 py-0.2 rounded">
                              24/7
                            </span>
                          )}
                          {service.verified && (
                            <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                          )}
                        </div>
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                          {service.name}
                        </h4>
                        <p className="text-xs text-slate-500 truncate mt-0.5">
                          {service.locality}
                        </p>
                      </div>

                      <ChevronRight className="w-4 h-4 text-slate-400 shrink-0 mt-1" />
                    </div>

                    <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100/60">
                      <span className="truncate">{service.openingHours}</span>
                      <Link
                        to={`/services/${service.id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="text-teal-700 hover:text-teal-800 font-bold ml-2 shrink-0"
                      >
                        View Details →
                      </Link>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Interactive Leaflet Map */}
        <div
          className={`flex-1 h-full relative ${
            mobileTab === 'list' ? 'hidden lg:block' : 'block'
          }`}
        >
          <InteractiveMap
            services={filteredServices}
            selectedService={selectedService}
            onSelectService={(s) => setSelectedService(s)}
            center={mapCenter}
            zoom={13}
            className="w-full h-full rounded-none border-0"
          />

          {/* Quick Map Floating Hint */}
          <div className="absolute top-4 left-4 z-[400] bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200 shadow-md text-xs font-semibold text-slate-800 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-teal-500"></span>
            <span>Showing {filteredServices.length} mapped facilities</span>
          </div>
        </div>
      </div>
    </div>
  );
}
