import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Tag, Layers, CheckCircle2 } from 'lucide-react';
import { api } from '../../services/api';
import Modal from '../../components/common/Modal';
import { useToast } from '../../context/ToastContext';
import { CategoryIcon, availableIconNames } from '../../utils/iconMap';

export default function AdminCategoriesPage() {
  const toast = useToast();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal & Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState('');
  const [icon, setIcon] = useState('Building2');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('#0d9488');

  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {
    setLoading(true);
    try {
      const data = await api.getCategories();
      setCategories(data);
    } catch (err) {
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  }

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setName('');
    setIcon('Building2');
    setDescription('');
    setColor('#0d9488');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cat) => {
    setEditingCategory(cat);
    setName(cat.name || '');
    setIcon(cat.icon || 'Building2');
    setDescription(cat.description || '');
    setColor(cat.color || '#0d9488');
    setIsModalOpen(true);
  };

  const handleDelete = async (id, catName) => {
    if (!window.confirm(`Are you sure you want to delete category "${catName}"?`)) return;

    try {
      await api.deleteCategory(id);
      toast.success('Category removed');
      setCategories((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      toast.error(err.message || 'Failed to delete category');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Category name is required');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        name: name.trim(),
        icon,
        description: description.trim(),
        color
      };

      if (editingCategory) {
        const updated = await api.updateCategory(editingCategory.id, payload);
        setCategories((prev) => prev.map((c) => (c.id === editingCategory.id ? { ...c, ...updated } : c)));
        toast.success('Category updated successfully');
      } else {
        const created = await api.createCategory(payload);
        setCategories((prev) => [...prev, created]);
        toast.success('New category created');
      }
      setIsModalOpen(false);
    } catch (err) {
      toast.error(err.message || 'Error saving category');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
            Service Categories
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Organize public services into intuitive civic groups with custom icons and theme colors.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm shadow transition active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Category</span>
        </button>
      </div>

      {/* Categories Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          <div className="col-span-full py-12 text-center text-xs text-slate-400">
            Loading categories...
          </div>
        ) : (
          categories.map((cat) => (
            <div
              key={cat.id}
              className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm flex flex-col justify-between relative overflow-hidden"
            >
              <div
                className="absolute top-0 left-0 right-0 h-1"
                style={{ backgroundColor: cat.color || '#0d9488' }}
              />

              <div>
                <div className="flex items-center justify-between mb-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{
                      backgroundColor: `${cat.color || '#0d9488'}15`,
                      color: cat.color || '#0d9488'
                    }}
                  >
                    <CategoryIcon name={cat.icon} className="w-5 h-5" color={cat.color} />
                  </div>

                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                    {cat.count || 0} services
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-base">{cat.name}</h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                  {cat.description || 'No description provided.'}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-mono">
                  slug: {cat.slug || cat.id}
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(cat)}
                    className="p-1 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition"
                    title="Edit Category"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(cat.id, cat.name)}
                    className="p-1 rounded-lg text-rose-400 hover:text-rose-600 hover:bg-rose-50 transition"
                    title="Delete Category"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add / Edit Category Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCategory ? 'Edit Category' : 'Create New Category'}
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Category Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Public Libraries or Community Centers"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Lucide Icon Identifier
            </label>
            <select
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 focus:outline-none bg-white cursor-pointer"
            >
              {availableIconNames.map((ico) => (
                <option key={ico} value={ico}>
                  {ico}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Theme Accent Color</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-10 h-10 rounded-lg cursor-pointer border border-slate-200"
              />
              <span className="font-mono text-xs text-slate-600 uppercase">{color}</span>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Description</label>
            <textarea
              rows={3}
              placeholder="Brief description of the services grouped in this category..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
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
              {saving ? 'Saving...' : editingCategory ? 'Update Category' : 'Create Category'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
