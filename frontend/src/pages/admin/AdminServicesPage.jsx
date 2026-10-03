import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  CheckCircle2,
  XCircle,
  Accessibility,
  Flame,
  Phone,
  MapPin,
  Clock,
  ExternalLink,
  Upload,
  AlertCircle
} from 'lucide-react';
import { api } from '../../services/api';
import Modal from '../../components/common/Modal';
import { useToast } from '../../context/ToastContext';
import { CategoryIcon } from '../../utils/iconMap';

export default function AdminServicesPage() {
  const toast = useToast();
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [saving, setSaving] = useState(false);

  // Form State
  const defaultFormData = {
    name: '',
    categoryId: '',
    description: '',
    address: '',
    locality: '',
    phone: '',
    openingHours: 'Open 24 Hours',
    latitude: 19.0178,
    longitude: 72.8478,
    emergencyAvailable: false,
    accessibilityAvailable: false,
    verified: true,
    isDemo: false,
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80'
  };
  const [formData, setFormData] = useState(defaultFormData);

  useEffect(() => {
    loadAll();
  }, []);

  async function loadAll() {
    setLoading(true);
    try {
      const [srvData, catData] = await Promise.all([
        api.getServices(),
        api.getCategories()
      ]);
      setServices(srvData);
      setCategories(catData);
      if (catData.length > 0 && !formData.categoryId) {
        setFormData((prev) => ({ ...prev, categoryId: catData[0].id }));
      }
    } catch (err) {
      toast.error('Failed to load services or categories');
    } finally {
      setLoading(false);
    }
  }

  const handleOpenAdd = () => {
    setEditingService(null);
    setFormData({
      ...defaultFormData,
      categoryId: categories[0]?.id || ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (srv) => {
    setEditingService(srv);
    setFormData({
      name: srv.name || '',
      categoryId: srv.categoryId || categories[0]?.id || '',
      description: srv.description || '',
      address: srv.address || '',
      locality: srv.locality || '',
      phone: srv.phone || '',
      openingHours: srv.openingHours || 'Open 24 Hours',
      latitude: srv.latitude || 19.0178,
      longitude: srv.longitude || 72.8478,
      emergencyAvailable: Boolean(srv.emergencyAvailable),
      accessibilityAvailable: Boolean(srv.accessibilityAvailable),
      verified: Boolean(srv.verified),
      isDemo: Boolean(srv.isDemo),
      image: srv.image || ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      return;
    }
    try {
      await api.deleteService(id);
      toast.success('Service facility deleted successfully');
      setServices((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      toast.error(err.message || 'Failed to delete service');
    }
  };

  const handleToggleVerified = async (srv) => {
    try {
      const updated = await api.updateService(srv.id, { verified: !srv.verified });
      setServices((prev) => prev.map((s) => (s.id === srv.id ? updated : s)));
      toast.success(`Service is now ${!srv.verified ? 'Verified' : 'Unverified'}`);
    } catch (err) {
      toast.error('Failed to update verification status');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.categoryId || !formData.address || !formData.locality) {
      toast.error('Name, category, address and locality are required');
      return;
    }

    setSaving(true);
    try {
      if (editingService) {
        const updated = await api.updateService(editingService.id, formData);
        setServices((prev) => prev.map((s) => (s.id === editingService.id ? updated : s)));
        toast.success('Service updated successfully');
      } else {
        const created = await api.createService(formData);
        setServices((prev) => [created, ...prev]);
        toast.success('New service created successfully');
      }
      setIsModalOpen(false);
    } catch (err) {
      toast.error(err.message || 'Error saving service');
    } finally {
      setSaving(false);
    }
  };

  const filtered = services.filter((s) => {
    if (categoryFilter !== 'all' && s.categoryId !== categoryFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        s.name.toLowerCase().includes(q) ||
        s.locality.toLowerCase().includes(q) ||
        s.address.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const categoryMap = categories.reduce((acc, c) => {
    acc[c.id] = c;
    return acc;
  }, {});

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
            Manage Public Services
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Add, edit, verify, or remove essential public facilities across surveyed wards.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm shadow transition active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Service</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-subtle flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
        <div className="relative flex items-center rounded-xl bg-slate-50 border border-slate-200 px-3 py-1.5 focus-within:ring-2 focus-within:ring-teal-500 w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
          <input
            type="text"
            placeholder="Search by name, locality..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent text-xs sm:text-sm focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <span className="text-slate-400 text-xs">Filter Category:</span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-700 focus:outline-none font-medium cursor-pointer"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Services Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm text-slate-700">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-[11px] uppercase font-bold text-slate-400 tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Service Facility</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Locality</th>
                <th className="py-3.5 px-4">Flags</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-xs text-slate-400">
                    Loading service records...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-xs text-slate-400">
                    No services found matching filters.
                  </td>
                </tr>
              ) : (
                filtered.map((srv) => {
                  const cat = categoryMap[srv.categoryId];
                  return (
                    <tr key={srv.id} className="hover:bg-slate-50/70 transition">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 leading-snug line-clamp-1">
                          {srv.name}
                        </div>
                        <div className="text-[11px] text-slate-400 truncate max-w-xs mt-0.5">
                          {srv.address}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded"
                          style={{
                            backgroundColor: `${cat?.color || '#0d9488'}15`,
                            color: cat?.color || '#0d9488'
                          }}
                        >
                          <CategoryIcon name={cat?.icon} className="w-3 h-3" />
                          {cat?.name || 'General'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap text-slate-600 font-medium">
                        {srv.locality}
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          {srv.emergencyAvailable && (
                            <span className="text-[10px] font-bold uppercase text-rose-700 bg-rose-50 px-1.5 py-0.2 rounded border border-rose-200">
                              24/7
                            </span>
                          )}
                          {srv.accessibilityAvailable && (
                            <span className="text-[10px] font-medium text-teal-700 bg-teal-50 px-1.5 py-0.2 rounded border border-teal-200" title="Wheelchair Accessible">
                              ♿
                            </span>
                          )}
                          {srv.isDemo && (
                            <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1 py-0.2 rounded">
                              Demo
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <button
                          onClick={() => handleToggleVerified(srv)}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold transition ${
                            srv.verified
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                              : 'bg-slate-100 text-slate-500 border border-slate-200 hover:bg-slate-200'
                          }`}
                        >
                          {srv.verified ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Verified</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3.5 h-3.5 text-slate-400" />
                              <span>Unverified</span>
                            </>
                          )}
                        </button>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap text-right space-x-2">
                        <button
                          onClick={() => handleOpenEdit(srv)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition"
                          title="Edit Service"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(srv.id, srv.name)}
                          className="p-1.5 rounded-lg text-rose-400 hover:text-rose-600 hover:bg-rose-50 transition"
                          title="Delete Service"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Service Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingService ? 'Edit Service Facility' : 'Add New Service Facility'}
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Service Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Bandra Municipal Hospital"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Category <span className="text-rose-500">*</span>
              </label>
              <select
                required
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 focus:outline-none bg-white"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Description & Available Services
            </label>
            <textarea
              rows={2}
              placeholder="Overview of public facilities, specialty clinics, casualty ward, subsidized medicines..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Street Address <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Hill Road, Near Railway Station"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Locality / Ward <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Bandra, Mumbai or Dadar West"
                value={formData.locality}
                onChange={(e) => setFormData({ ...formData, locality: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Phone Number</label>
              <input
                type="text"
                placeholder="e.g. 022-26422775 or 108"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Opening Hours</label>
              <input
                type="text"
                placeholder="e.g. Open 24 Hours or 8:00 AM - 9:00 PM"
                value={formData.openingHours}
                onChange={(e) => setFormData({ ...formData, openingHours: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Latitude <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                step="any"
                required
                value={formData.latitude}
                onChange={(e) => setFormData({ ...formData, latitude: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Longitude <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                step="any"
                required
                value={formData.longitude}
                onChange={(e) => setFormData({ ...formData, longitude: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Photo Image URL</label>
            <input
              type="text"
              placeholder="https://images.unsplash.com/..."
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
          </div>

          {/* Feature Checkboxes */}
          <div className="pt-2 grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200/80">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
              <input
                type="checkbox"
                checked={formData.emergencyAvailable}
                onChange={(e) => setFormData({ ...formData, emergencyAvailable: e.target.checked })}
                className="rounded text-teal-600 focus:ring-teal-500"
              />
              <span>24/7 Emergency</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
              <input
                type="checkbox"
                checked={formData.accessibilityAvailable}
                onChange={(e) => setFormData({ ...formData, accessibilityAvailable: e.target.checked })}
                className="rounded text-teal-600 focus:ring-teal-500"
              />
              <span>Accessible</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
              <input
                type="checkbox"
                checked={formData.verified}
                onChange={(e) => setFormData({ ...formData, verified: e.target.checked })}
                className="rounded text-teal-600 focus:ring-teal-500"
              />
              <span>Verified Status</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
              <input
                type="checkbox"
                checked={formData.isDemo}
                onChange={(e) => setFormData({ ...formData, isDemo: e.target.checked })}
                className="rounded text-teal-600 focus:ring-teal-500"
              />
              <span>Demo Tag</span>
            </label>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow transition disabled:opacity-50"
            >
              {saving ? 'Saving...' : editingService ? 'Update Service' : 'Create Service'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
