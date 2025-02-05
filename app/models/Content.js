import mongoose from 'mongoose';

const ContentSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true, // Clerk user ID
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  contentType: {
    type: String,
    enum: ['article', 'video', 'course', 'image'],
    required: true,
  },
  contentURL: {
    type: String,
    required: true,
  },
  thumbnailURL: String,
  creatorWallet: {
    type: String,
    required: true,
  },
  subscriptionTier: {
    type: String,
    enum: ['free', 'basic', 'premium'],
    default: 'free',
  },
  price: {
    type: Number,
    default: 0,
  },
  categories: {
    type: [String],
    default: [],
  },
  isPublished: {
    type: Boolean,
    default: false,
  },
  views: {
    type: Number,
    default: 0,
  },
  earnings: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  }
});

ContentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.models.Content || mongoose.model('Content', ContentSchema); 