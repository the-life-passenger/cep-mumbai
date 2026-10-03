import mongoose from 'mongoose';

const surveyResponseSchema = new mongoose.Schema({
  name: { type: String, default: 'Anonymous Resident' },
  locality: { type: String, required: true },
  ageGroup: { type: String, required: true },
  serviceAccessProblem: { type: String, required: true },
  servicesAvailableNearby: { type: String, default: '' },
  problemsFindingInfo: { type: String, default: '' },
  accessibilityProblem: { type: String, default: '' },
  suggestions: { type: String, default: '' },
  comments: { type: String, default: '' }
}, {
  timestamps: true,
  toJSON: {
    transform: (doc, ret) => {
      ret.id = ret._id.toString();
      return ret;
    }
  }
});

export const SurveyResponse = mongoose.model('SurveyResponse', surveyResponseSchema);
