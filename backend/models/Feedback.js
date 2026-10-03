import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema({
  name: { type: String, default: 'Community Member' },
  rating: { type: Number, required: true, min: 1, max: 5 },
  feedback: { type: String, required: true },
  suggestion: { type: String, default: '' },
  approved: { type: Boolean, default: false }
}, {
  timestamps: true,
  toJSON: {
    transform: (doc, ret) => {
      ret.id = ret._id.toString();
      return ret;
    }
  }
});

export const Feedback = mongoose.model('Feedback', feedbackSchema);
