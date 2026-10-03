import mongoose from 'mongoose';

const siteContentSchema = new mongoose.Schema({
  heroBadge: { type: String, default: 'COMMUNITY SERVICE DIRECTORY' },
  heroHeading: { type: String, default: 'Essential Services. Right Where You Need Them.' },
  heroDescription: { type: String, default: 'Discover essential public services in your locality through a simple, accessible and community-powered digital directory.' },
  aboutProblem: { type: String, default: '' },
  aboutObjective: { type: String, default: '' },
  aboutMethodology: [{ type: String }],
  emergencyHelplines: [{
    title: { type: String },
    number: { type: String },
    desc: { type: String }
  }],
  contactEmail: { type: String, default: 'cep.community@university-project.edu' },
  contactPhone: { type: String, default: '+91 22 2654 3000' },
  contactLocality: { type: String, default: 'Mumbai, Maharashtra, India' },
  projectDisclaimer: { type: String, default: '' }
}, {
  timestamps: true,
  toJSON: {
    transform: (doc, ret) => {
      ret.id = ret._id.toString();
      return ret;
    }
  }
});

export const SiteContent = mongoose.model('SiteContent', siteContentSchema);
