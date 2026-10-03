import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, lowercase: true, trim: true },
  icon: { type: String, required: true, default: 'Building2' },
  description: { type: String, default: '' },
  color: { type: String, default: '#0d9488' }
}, {
  timestamps: true,
  toJSON: {
    transform: (doc, ret) => {
      ret.id = ret._id.toString();
      return ret;
    }
  }
});

export const Category = mongoose.model('Category', categorySchema);
