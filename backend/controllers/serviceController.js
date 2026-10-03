import { ServicesRepo, CategoriesRepo } from '../data/repo.js';

export async function getServices(req, res, next) {
  try {
    const {
      categoryId,
      locality,
      search,
      emergencyAvailable,
      accessibilityAvailable,
      verified,
      sort
    } = req.query;

    const services = await ServicesRepo.getAll({
      categoryId,
      locality,
      search,
      emergencyAvailable,
      accessibilityAvailable,
      verified,
      sort
    });

    res.json(services);
  } catch (err) {
    next(err);
  }
}

export async function getServiceById(req, res, next) {
  try {
    const service = await ServicesRepo.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    // Get category info
    const category = await CategoriesRepo.findById(service.categoryId);

    // Get related services (same category or same locality, excluding current)
    const allServices = await ServicesRepo.getAll();
    const related = allServices
      .filter(s => s.id !== service.id && (s.categoryId === service.categoryId || s.locality === service.locality))
      .slice(0, 3);

    res.json({
      ...service,
      categoryName: category ? category.name : 'Public Service',
      categoryIcon: category ? category.icon : 'Building2',
      categoryColor: category ? category.color : '#0d9488',
      related
    });
  } catch (err) {
    next(err);
  }
}

export async function createService(req, res, next) {
  try {
    const {
      name,
      categoryId,
      description,
      address,
      locality,
      phone,
      openingHours,
      latitude,
      longitude,
      emergencyAvailable,
      accessibilityAvailable,
      image,
      verified,
      isDemo
    } = req.body;

    if (!name || !categoryId || !address || !locality || latitude === undefined || longitude === undefined) {
      return res.status(400).json({
        message: 'Name, Category, Address, Locality, Latitude and Longitude are required fields'
      });
    }

    const newService = await ServicesRepo.create({
      name: name.trim(),
      categoryId,
      description: description || '',
      address: address.trim(),
      locality: locality.trim(),
      phone: phone || '',
      openingHours: openingHours || 'Open 24 Hours',
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      emergencyAvailable: Boolean(emergencyAvailable),
      accessibilityAvailable: Boolean(accessibilityAvailable),
      image: image || 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80',
      verified: verified !== undefined ? Boolean(verified) : false,
      isDemo: Boolean(isDemo)
    });

    res.status(201).json(newService);
  } catch (err) {
    next(err);
  }
}

export async function updateService(req, res, next) {
  try {
    const { id } = req.params;
    const existing = await ServicesRepo.findById(id);
    if (!existing) {
      return res.status(404).json({ message: 'Service not found' });
    }

    const updates = { ...req.body };
    if (updates.latitude !== undefined) updates.latitude = parseFloat(updates.latitude);
    if (updates.longitude !== undefined) updates.longitude = parseFloat(updates.longitude);
    if (updates.emergencyAvailable !== undefined) updates.emergencyAvailable = Boolean(updates.emergencyAvailable);
    if (updates.accessibilityAvailable !== undefined) updates.accessibilityAvailable = Boolean(updates.accessibilityAvailable);
    if (updates.verified !== undefined) updates.verified = Boolean(updates.verified);

    const updated = await ServicesRepo.update(id, updates);
    res.json(updated);
  } catch (err) {
    next(err);
  }
}

export async function deleteService(req, res, next) {
  try {
    const { id } = req.params;
    const deleted = await ServicesRepo.delete(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.json({ message: 'Service deleted successfully', id });
  } catch (err) {
    next(err);
  }
}

export async function getLocalities(req, res, next) {
  try {
    const localities = await ServicesRepo.getLocalities();
    res.json(localities);
  } catch (err) {
    next(err);
  }
}

export async function getServiceStats(req, res, next) {
  try {
    const services = await ServicesRepo.getAll();
    const categories = await CategoriesRepo.getAll();

    const total = services.length;
    const verified = services.filter(s => s.verified).length;
    const emergency = services.filter(s => s.emergencyAvailable).length;
    const accessible = services.filter(s => s.accessibilityAvailable).length;
    const demoCount = services.filter(s => s.isDemo).length;

    // Services by Category
    const categoryMap = {};
    categories.forEach(c => {
      categoryMap[c.id] = { name: c.name, count: 0, color: c.color };
    });
    services.forEach(s => {
      if (categoryMap[s.categoryId]) {
        categoryMap[s.categoryId].count++;
      }
    });
    const byCategory = Object.values(categoryMap);

    // Services by Locality
    const localityCounts = {};
    services.forEach(s => {
      const loc = (s.locality || 'Other').split(',')[0].trim();
      localityCounts[loc] = (localityCounts[loc] || 0) + 1;
    });
    const byLocality = Object.entries(localityCounts).map(([name, count]) => ({
      name,
      count
    })).sort((a, b) => b.count - a.count);

    res.json({
      total,
      verified,
      emergency,
      accessible,
      demoCount,
      byCategory,
      byLocality
    });
  } catch (err) {
    next(err);
  }
}
