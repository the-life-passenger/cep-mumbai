import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import {
  initialCategories,
  initialServices,
  initialSurveys,
  initialFeedback,
  initialContent
} from './seedData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = __dirname;

const files = {
  users: path.join(DATA_DIR, 'users.json'),
  categories: path.join(DATA_DIR, 'categories.json'),
  services: path.join(DATA_DIR, 'services.json'),
  surveys: path.join(DATA_DIR, 'surveys.json'),
  feedback: path.join(DATA_DIR, 'feedback.json'),
  content: path.join(DATA_DIR, 'content.json')
};

// Helper: read file or return fallback
function readFileSafe(filePath, fallback = []) {
  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err.message);
  }
  return fallback;
}

// Helper: write file
function writeFileSafe(filePath, data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error(`Error writing ${filePath}:`, err.message);
  }
}

// Initialize default data if not present
export async function initializeStore() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  // 1. Users
  if (!fs.existsSync(files.users) || readFileSafe(files.users).length === 0) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);
    const defaultUsers = [
      {
        id: 'usr-admin-1',
        name: 'Project Administrator',
        email: 'admin@mylocal.org',
        password: hashedPassword,
        role: 'admin',
        createdAt: new Date().toISOString()
      }
    ];
    writeFileSafe(files.users, defaultUsers);
    console.log('[Store] Seeded default admin user: admin@mylocal.org');
  }

  // 2. Categories
  if (!fs.existsSync(files.categories) || readFileSafe(files.categories).length === 0) {
    writeFileSafe(files.categories, initialCategories);
    console.log('[Store] Seeded initial categories');
  }

  // 3. Services
  if (!fs.existsSync(files.services) || readFileSafe(files.services).length === 0) {
    writeFileSafe(files.services, initialServices);
    console.log('[Store] Seeded initial services');
  }

  // 4. Surveys
  if (!fs.existsSync(files.surveys) || readFileSafe(files.surveys).length === 0) {
    writeFileSafe(files.surveys, initialSurveys);
    console.log('[Store] Seeded initial survey responses');
  }

  // 5. Feedback
  if (!fs.existsSync(files.feedback) || readFileSafe(files.feedback).length === 0) {
    writeFileSafe(files.feedback, initialFeedback);
    console.log('[Store] Seeded initial feedback');
  }

  // 6. Content
  if (!fs.existsSync(files.content) || !readFileSafe(files.content).heroHeading) {
    writeFileSafe(files.content, initialContent);
    console.log('[Store] Seeded site content configuration');
  }

  console.log('[Store] File-backed data store initialized successfully.');
}

// Generic collection manager
export class StoreCollection {
  constructor(key) {
    this.key = key;
    this.filePath = files[key];
  }

  async getAll() {
    return readFileSafe(this.filePath, []);
  }

  async find(predicate) {
    const all = await this.getAll();
    return all.filter(predicate);
  }

  async findOne(predicate) {
    const all = await this.getAll();
    return all.find(predicate) || null;
  }

  async findById(id) {
    const all = await this.getAll();
    return all.find(item => item.id === id || item._id === id) || null;
  }

  async create(item) {
    const all = await this.getAll();
    const newItem = {
      id: item.id || `id-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...item
    };
    all.unshift(newItem);
    writeFileSafe(this.filePath, all);
    return newItem;
  }

  async findByIdAndUpdate(id, updates) {
    const all = await this.getAll();
    const index = all.findIndex(item => item.id === id || item._id === id);
    if (index === -1) return null;

    all[index] = {
      ...all[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    writeFileSafe(this.filePath, all);
    return all[index];
  }

  async findByIdAndDelete(id) {
    const all = await this.getAll();
    const index = all.findIndex(item => item.id === id || item._id === id);
    if (index === -1) return null;

    const removed = all.splice(index, 1)[0];
    writeFileSafe(this.filePath, all);
    return removed;
  }

  async countDocuments(predicate = null) {
    const all = await this.getAll();
    if (!predicate) return all.length;
    return all.filter(predicate).length;
  }
}

// Single-document collection for Site Content
export class StoreDocument {
  constructor(key, fallback = {}) {
    this.key = key;
    this.filePath = files[key];
    this.fallback = fallback;
  }

  async get() {
    return readFileSafe(this.filePath, this.fallback);
  }

  async update(updates) {
    const current = await this.get();
    const updated = {
      ...current,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    writeFileSafe(this.filePath, updated);
    return updated;
  }
}

export const usersStore = new StoreCollection('users');
export const categoriesStore = new StoreCollection('categories');
export const servicesStore = new StoreCollection('services');
export const surveysStore = new StoreCollection('surveys');
export const feedbackStore = new StoreCollection('feedback');
export const contentStore = new StoreDocument('content', initialContent);
