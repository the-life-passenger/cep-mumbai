import mongoose from 'mongoose';
import {
  usersStore,
  categoriesStore,
  servicesStore,
  surveysStore,
  feedbackStore,
  contentStore
} from './store.js';

import { User } from '../models/User.js';
import { Category } from '../models/Category.js';
import { Service } from '../models/Service.js';
import { SurveyResponse } from '../models/SurveyResponse.js';
import { Feedback } from '../models/Feedback.js';
import { SiteContent } from '../models/SiteContent.js';

function isMongooseConnected() {
  return mongoose.connection.readyState === 1;
}

// Normalize document to include clean .id and string fields
function normalizeDoc(doc) {
  if (!doc) return null;
  const obj = doc.toObject ? doc.toObject() : { ...doc };
  if (obj._id && !obj.id) {
    obj.id = obj._id.toString();
  }
  return obj;
}

// Users Repository
export const UsersRepo = {
  async findByEmail(email) {
    const cleanEmail = email.toLowerCase().trim();
    if (isMongooseConnected()) {
      const doc = await User.findOne({ email: cleanEmail });
      return doc ? normalizeDoc(doc) : null;
    }
    return usersStore.findOne(u => u.email.toLowerCase() === cleanEmail);
  },

  async findById(id) {
    if (isMongooseConnected()) {
      const doc = await User.findById(id);
      return doc ? normalizeDoc(doc) : null;
    }
    return usersStore.findById(id);
  },

  async create(userData) {
    if (isMongooseConnected()) {
      const doc = await User.create(userData);
      return normalizeDoc(doc);
    }
    return usersStore.create(userData);
  }
};

// Categories Repository
export const CategoriesRepo = {
  async getAll() {
    if (isMongooseConnected()) {
      const docs = await Category.find().sort({ name: 1 });
      return docs.map(normalizeDoc);
    }
    const all = await categoriesStore.getAll();
    return all.sort((a, b) => a.name.localeCompare(b.name));
  },

  async findById(id) {
    if (isMongooseConnected()) {
      const doc = await Category.findById(id);
      return doc ? normalizeDoc(doc) : null;
    }
    return categoriesStore.findById(id);
  },

  async create(data) {
    if (isMongooseConnected()) {
      const doc = await Category.create(data);
      return normalizeDoc(doc);
    }
    return categoriesStore.create(data);
  },

  async update(id, updates) {
    if (isMongooseConnected()) {
      const doc = await Category.findByIdAndUpdate(id, updates, { new: true });
      return doc ? normalizeDoc(doc) : null;
    }
    return categoriesStore.findByIdAndUpdate(id, updates);
  },

  async delete(id) {
    if (isMongooseConnected()) {
      const doc = await Category.findByIdAndDelete(id);
      return doc ? normalizeDoc(doc) : null;
    }
    return categoriesStore.findByIdAndDelete(id);
  }
};

// Services Repository
export const ServicesRepo = {
  async getAll(filters = {}) {
    const {
      categoryId,
      locality,
      search,
      emergencyAvailable,
      accessibilityAvailable,
      verified,
      sort
    } = filters;

    let items;
    if (isMongooseConnected()) {
      const query = {};
      if (categoryId && categoryId !== 'all') query.categoryId = categoryId;
      if (locality && locality !== 'all') query.locality = new RegExp(locality, 'i');
      if (emergencyAvailable === true || emergencyAvailable === 'true') query.emergencyAvailable = true;
      if (accessibilityAvailable === true || accessibilityAvailable === 'true') query.accessibilityAvailable = true;
      if (verified === true || verified === 'true') query.verified = true;

      if (search) {
        const regex = new RegExp(search, 'i');
        query.$or = [
          { name: regex },
          { locality: regex },
          { address: regex },
          { description: regex }
        ];
      }

      const docs = await Service.find(query);
      items = docs.map(normalizeDoc);
    } else {
      items = await servicesStore.getAll();
      if (categoryId && categoryId !== 'all') {
        items = items.filter(s => s.categoryId === categoryId);
      }
      if (locality && locality !== 'all') {
        items = items.filter(s => s.locality.toLowerCase().includes(locality.toLowerCase()));
      }
      if (emergencyAvailable === true || emergencyAvailable === 'true') {
        items = items.filter(s => s.emergencyAvailable === true);
      }
      if (accessibilityAvailable === true || accessibilityAvailable === 'true') {
        items = items.filter(s => s.accessibilityAvailable === true);
      }
      if (verified === true || verified === 'true') {
        items = items.filter(s => s.verified === true);
      }
      if (search) {
        const s = search.toLowerCase();
        items = items.filter(item =>
          item.name.toLowerCase().includes(s) ||
          item.locality.toLowerCase().includes(s) ||
          item.address.toLowerCase().includes(s) ||
          (item.description && item.description.toLowerCase().includes(s))
        );
      }
    }

    // Sorting
    if (sort === 'alphabetical') {
      items.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort === 'category') {
      items.sort((a, b) => a.categoryId.localeCompare(b.categoryId));
    } else {
      // Default: newest first or verified first
      items.sort((a, b) => (b.verified ? 1 : 0) - (a.verified ? 1 : 0));
    }

    return items;
  },

  async findById(id) {
    if (isMongooseConnected()) {
      const doc = await Service.findById(id);
      return doc ? normalizeDoc(doc) : null;
    }
    return servicesStore.findById(id);
  },

  async create(data) {
    if (isMongooseConnected()) {
      const doc = await Service.create(data);
      return normalizeDoc(doc);
    }
    return servicesStore.create(data);
  },

  async update(id, updates) {
    if (isMongooseConnected()) {
      const doc = await Service.findByIdAndUpdate(id, updates, { new: true });
      return doc ? normalizeDoc(doc) : null;
    }
    return servicesStore.findByIdAndUpdate(id, updates);
  },

  async delete(id) {
    if (isMongooseConnected()) {
      const doc = await Service.findByIdAndDelete(id);
      return doc ? normalizeDoc(doc) : null;
    }
    return servicesStore.findByIdAndDelete(id);
  },

  async getLocalities() {
    const all = await this.getAll();
    const set = new Set();
    all.forEach(s => {
      if (s.locality) {
        // extract primary locality word e.g. Dadar, Bandra, Kurla
        const loc = s.locality.split(',')[0].trim();
        if (loc) set.add(loc);
      }
    });
    return Array.from(set).sort();
  }
};

// Surveys Repository
export const SurveysRepo = {
  async getAll() {
    if (isMongooseConnected()) {
      const docs = await SurveyResponse.find().sort({ createdAt: -1 });
      return docs.map(normalizeDoc);
    }
    return surveysStore.getAll();
  },

  async findById(id) {
    if (isMongooseConnected()) {
      const doc = await SurveyResponse.findById(id);
      return doc ? normalizeDoc(doc) : null;
    }
    return surveysStore.findById(id);
  },

  async create(data) {
    if (isMongooseConnected()) {
      const doc = await SurveyResponse.create(data);
      return normalizeDoc(doc);
    }
    return surveysStore.create(data);
  },

  async delete(id) {
    if (isMongooseConnected()) {
      const doc = await SurveyResponse.findByIdAndDelete(id);
      return doc ? normalizeDoc(doc) : null;
    }
    return surveysStore.findByIdAndDelete(id);
  }
};

// Feedback Repository
export const FeedbackRepo = {
  async getAll(onlyApproved = false) {
    if (isMongooseConnected()) {
      const query = onlyApproved ? { approved: true } : {};
      const docs = await Feedback.find(query).sort({ createdAt: -1 });
      return docs.map(normalizeDoc);
    }
    const all = await feedbackStore.getAll();
    if (onlyApproved) {
      return all.filter(f => f.approved === true);
    }
    return all;
  },

  async findById(id) {
    if (isMongooseConnected()) {
      const doc = await Feedback.findById(id);
      return doc ? normalizeDoc(doc) : null;
    }
    return feedbackStore.findById(id);
  },

  async create(data) {
    if (isMongooseConnected()) {
      const doc = await Feedback.create(data);
      return normalizeDoc(doc);
    }
    return feedbackStore.create(data);
  },

  async update(id, updates) {
    if (isMongooseConnected()) {
      const doc = await Feedback.findByIdAndUpdate(id, updates, { new: true });
      return doc ? normalizeDoc(doc) : null;
    }
    return feedbackStore.findByIdAndUpdate(id, updates);
  },

  async delete(id) {
    if (isMongooseConnected()) {
      const doc = await Feedback.findByIdAndDelete(id);
      return doc ? normalizeDoc(doc) : null;
    }
    return feedbackStore.findByIdAndDelete(id);
  }
};

// Site Content Repository
export const ContentRepo = {
  async get() {
    if (isMongooseConnected()) {
      let doc = await SiteContent.findOne();
      if (!doc) {
        const initial = await contentStore.get();
        doc = await SiteContent.create(initial);
      }
      return normalizeDoc(doc);
    }
    return contentStore.get();
  },

  async update(updates) {
    if (isMongooseConnected()) {
      let doc = await SiteContent.findOne();
      if (doc) {
        doc = await SiteContent.findByIdAndUpdate(doc._id, updates, { new: true });
      } else {
        doc = await SiteContent.create(updates);
      }
      return normalizeDoc(doc);
    }
    return contentStore.update(updates);
  }
};
