import { CategoriesRepo, ServicesRepo } from '../data/repo.js';

export async function getCategories(req, res, next) {
  try {
    const categories = await CategoriesRepo.getAll();
    const services = await ServicesRepo.getAll();

    // Attach dynamic live service count to each category
    const categoriesWithCount = categories.map(cat => {
      const count = services.filter(s => s.categoryId === cat.id).length;
      return {
        ...cat,
        count
      };
    });

    res.json(categoriesWithCount);
  } catch (err) {
    next(err);
  }
}

export async function getCategoryById(req, res, next) {
  try {
    const category = await CategoriesRepo.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json(category);
  } catch (err) {
    next(err);
  }
}

export async function createCategory(req, res, next) {
  try {
    const { name, icon, description, color } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Category name is required' });
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const newCategory = await CategoriesRepo.create({
      name: name.trim(),
      slug,
      icon: icon || 'Building2',
      description: description || '',
      color: color || '#0d9488'
    });

    res.status(201).json(newCategory);
  } catch (err) {
    next(err);
  }
}

export async function updateCategory(req, res, next) {
  try {
    const { id } = req.params;
    const existing = await CategoriesRepo.findById(id);
    if (!existing) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const updates = { ...req.body };
    if (updates.name) {
      updates.slug = updates.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }

    const updated = await CategoriesRepo.update(id, updates);
    res.json(updated);
  } catch (err) {
    next(err);
  }
}

export async function deleteCategory(req, res, next) {
  try {
    const { id } = req.params;
    // Check if services belong to this category
    const services = await ServicesRepo.getAll();
    const inUse = services.filter(s => s.categoryId === id);
    if (inUse.length > 0) {
      return res.status(400).json({
        message: `Cannot delete category. It is currently assigned to ${inUse.length} service(s). Reassign them first.`
      });
    }

    const deleted = await CategoriesRepo.delete(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json({ message: 'Category deleted successfully', id });
  } catch (err) {
    next(err);
  }
}
