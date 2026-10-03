import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Search,
  Filter,
  SlidersHorizontal,
  Compass,
  CheckCircle2,
  Accessibility,
  Flame,
  Clock,
  LayoutGrid,
  List,
  RotateCcw,
  Sparkles,
  MapPin,
  X
} from 'lucide-react';
import { api } from '../services/api';
import { useDebounce } from '../hooks/useDebounce';
import ServiceCard from '../components/service/ServiceCard';
import { ServiceCardSkeleton } from '../components/common/Skeleton';
import EmptyState from '../components/common/EmptyState';
import { CategoryIcon } from '../utils/iconMap';

export default function ServicesPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Search and Filter States initialized from URL params if present
  const initialCategory = searchParams.get('categoryId') || 'all';
  const initialSearch = searchParams.get('search') || '';
  const initialLocality = searchParams.get('locality') || 'all';

  const [search, setSearch] = useState(initialSearch);
  const debouncedSearch = useDebounce(search, 300);

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedLocality, setSelectedLocality] = useState(initialLocality);
  const [emergencyOnly, setEmergencyOnly] = useState(false);
  const [accessibleOnly, setAccessibleOnly] = useState(false);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [sortOption, setSortOption] = useState('recommended');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'

  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [localities, setLocalities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Sync category from URL param if query param changes externally
  useEffect(() => {
    const cat = searchParams.get('categoryId');
    if (cat && cat !== selectedCategory) {
      setSelectedCategory(cat);
    }
    const q = searchParams.get('search');
    if (q && q !== search) {
      setSearch(q);
    }
  }, [searchParams]);

  // Load Categories & Localities once
  useEffect(() => {
    async function loadMeta() {
      try {
        const [catsRes, locsRes] = await Promise.all([
          api.getCategories(),
          api.getLocalities()
        ]);
        setCategories(catsRes);
        setLocalities(locsRes);
      } catch (err) {
        console.error('Failed to load categories or localities:', err);
      }
    }
    loadMeta();
  }, []);

  // Fetch Services when filters change
  useEffect(() => {
    async function fetchServices() {
      setLoading(true);
      setError(null);
      try {
        const params = {
          search: debouncedSearch,
          categoryId: selectedCategory !== 'all' ? selectedCategory : undefined,
          locality: selectedLocality !== 'all' ? selectedLocality : undefined,
          emergencyAvailable: emergencyOnly ? true : undefined,
          accessibilityAvailable: accessibleOnly ? true : undefined,
          verified: verifiedOnly ? true : undefined,
          sort: sortOption
        };

        const data = await api.getServices(params);
        setServices(data);
      } catch (err) {
        setError(err.message || 'Failed to load services directory');
      } finally {
        setLoading(false);
      }
    }

    fetchServices();
  }, [
    debouncedSearch,
    selectedCategory,
    selectedLocality,
    emergencyOnly,
    accessibleOnly,
    verifiedOnly,
    sortOption
  ]);

  const resetFilters = () => {
    setSearch('');
    setSelectedCategory('all');
    setSelectedLocality('all');
    setEmergencyOnly(false);
    setAccessibleOnly(false);
    setVerifiedOnly(false);
    setSortOption('recommended');
    setSearchParams({});
  };

  const hasActiveFilters =
    debouncedSearch ||
    selectedCategory !== 'all' ||
    selectedLocality !== 'all' ||
    emergencyOnly ||
    accessibleOnly ||
    verifiedOnly;

  const categoryMap = categories.reduce((acc, cat) => {
    acc[cat.id] = cat;
    return acc;
  }, {});

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* 1. Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-semibold uppercase tracking-wider mb-2 border border-teal-200/60">
            <Compass className="w-3.5 h-3.5 text-teal-600" />
            Civic Directory
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-sans">
            Find Essential Services
          </h1>
          <p className="text-sm sm:text-base text-slate-600 mt-1 max-w-2xl">
            Search and filter verified public healthcare, emergency facilities, public toilets, and government offices across surveyed localities.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            to="/map"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold shadow-sm transition active:scale-95"
          >
            <Compass className="w-4 h-4 text-teal-400" />
            <span>Open Map View</span>
          </Link>
        </div>
      </div>

      {/* 2. Main Search Bar & Quick Toggles */}
      <div className="space-y-4">
        <div className="relative flex items-center shadow-sm rounded-2xl bg-white p-2 border border-slate-200 focus-within:ring-2 focus-within:ring-teal-500 focus-within:border-teal-500 transition-all">
          <Search className="w-5 h-5 text-slate-400 ml-3 shrink-0" />
          <input
            type="text"
            placeholder="Search services, locations, keywords (e.g. trauma, 24/7 chemist, Dadar)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-3 py-2 text-sm sm:text-base text-slate-900 placeholder-slate-400 bg-transparent focus:outline-none"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg mr-1 transition"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* 3. Category Filter Chips (Horizontal Scrolling on Mobile) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none text-xs sm:text-sm font-medium">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-xl whitespace-nowrap transition-all duration-200 flex items-center gap-1.5 shrink-0 ${
              selectedCategory === 'all'
                ? 'bg-slate-900 text-white font-semibold shadow-sm'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <span>All Categories</span>
          </button>

          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-2 rounded-xl whitespace-nowrap transition-all duration-200 flex items-center gap-2 shrink-0 ${
                  isSelected
                    ? 'bg-teal-700 text-white font-semibold shadow-sm'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <CategoryIcon
                  name={cat.icon}
                  className="w-4 h-4"
                  color={isSelected ? '#ffffff' : cat.color}
                />
                <span>{cat.name}</span>
                {cat.count !== undefined && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {cat.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* 4. Secondary Filter Bar (Locality, Quick Flags, Sorting & Layout Switcher) */}
        <div className="bg-slate-50/80 rounded-2xl border border-slate-200/80 p-4 flex flex-wrap items-center justify-between gap-4 text-xs sm:text-sm">
          {/* Left: Dropdowns & Toggles */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Locality Selector */}
            <div className="flex items-center gap-1.5 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-subtle">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <select
                value={selectedLocality}
                onChange={(e) => setSelectedLocality(e.target.value)}
                className="bg-transparent text-slate-700 font-medium text-xs sm:text-sm focus:outline-none cursor-pointer"
              >
                <option value="all">All Localities</option>
                {localities.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>

            {/* Quick Filter: 24/7 Emergency */}
            <button
              onClick={() => setEmergencyOnly(!emergencyOnly)}
              className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition ${
                emergencyOnly
                  ? 'bg-rose-50 border-rose-300 text-rose-700 shadow-sm'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${emergencyOnly ? 'bg-rose-600 animate-pulse' : 'bg-slate-400'}`}></span>
              <span>24/7 Emergency</span>
            </button>

            {/* Quick Filter: Accessible */}
            <button
              onClick={() => setAccessibleOnly(!accessibleOnly)}
              className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition ${
                accessibleOnly
                  ? 'bg-teal-50 border-teal-300 text-teal-700 shadow-sm'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Accessibility className="w-3.5 h-3.5 text-teal-600" />
              <span>Wheelchair Accessible</span>
            </button>

            {/* Quick Filter: Verified Only */}
            <button
              onClick={() => setVerifiedOnly(!verifiedOnly)}
              className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition ${
                verifiedOnly
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-700 shadow-sm'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Verified Only</span>
            </button>

            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="inline-flex items-center gap-1 text-xs text-rose-600 hover:text-rose-700 font-semibold px-2 py-1 transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset All</span>
              </button>
            )}
          </div>

          {/* Right: Sorting & View Mode */}
          <div className="flex items-center gap-3 ml-auto">
            <div className="flex items-center gap-1.5 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-subtle text-xs">
              <span className="text-slate-400 font-medium">Sort:</span>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="bg-transparent text-slate-800 font-semibold focus:outline-none cursor-pointer"
              >
                <option value="recommended">Recommended (Verified First)</option>
                <option value="alphabetical">Alphabetical (A - Z)</option>
                <option value="category">Category</option>
              </select>
            </div>

            {/* Grid vs List toggle */}
            <div className="hidden sm:flex items-center bg-white border border-slate-200 p-0.5 rounded-xl shadow-subtle">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition ${
                  viewMode === 'grid'
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Grid view"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition ${
                  viewMode === 'list'
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="List view"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Results Counter & Active Query Status */}
      <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
        <div>
          Showing <span className="font-bold text-slate-900">{services.length}</span>{' '}
          {services.length === 1 ? 'service facility' : 'service facilities'}
          {selectedCategory !== 'all' && (
            <span> in <span className="font-bold text-teal-700">{categoryMap[selectedCategory]?.name}</span></span>
          )}
          {selectedLocality !== 'all' && (
            <span> around <span className="font-bold text-slate-800">{selectedLocality}</span></span>
          )}
        </div>
        <div className="text-[11px] text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
          [DEMO DATA - In progress field survey]
        </div>
      </div>

      {/* 6. Services Grid / List or States */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ServiceCardSkeleton />
          <ServiceCardSkeleton />
          <ServiceCardSkeleton />
          <ServiceCardSkeleton />
          <ServiceCardSkeleton />
          <ServiceCardSkeleton />
        </div>
      ) : error ? (
        <div className="p-8 text-center bg-rose-50 border border-rose-200 rounded-2xl max-w-lg mx-auto my-8">
          <p className="text-sm font-semibold text-rose-800">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-rose-700 text-white rounded-xl text-xs font-bold hover:bg-rose-800 transition"
          >
            Try Again
          </button>
        </div>
      ) : services.length === 0 ? (
        <EmptyState
          title="No services match your filters"
          description="We couldn't locate any public facilities with the selected criteria. Try removing filters or searching for a broader locality."
          actionLabel="Reset All Filters"
          onAction={resetFilters}
        />
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              categoryMap={categoryMap}
            />
          ))}
        </div>
      ) : (
        /* List View */
        <div className="space-y-4">
          {services.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              categoryMap={categoryMap}
            />
          ))}
        </div>
      )}
    </div>
  );
}
