import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
  categoryId: { type: String, required: true },
  name: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  address: { type: String, required: true },
  locality: { type: String, required: true },
  phone: { type: String, default: '' },
  openingHours: { type: String, default: 'Open 24 Hours' },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  emergencyAvailable: { type: Boolean, default: false },
  accessibilityAvailable: { type: Boolean, default: false },
  image: { type: String, default: '' },
  verified: { type: Boolean, default: false },
  isDemo: { type: Boolean, default: false }
}, {
  timestamps: true,
  toJSON: {
    transform: (doc, ret) => {
      ret.id = ret._id.toString();
      return ret;
    }
  }
});

export const Service = mongoose.model('Service', serviceSchema);
