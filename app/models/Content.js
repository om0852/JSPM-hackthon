import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true, // Clerk user ID
  },
  userName: {
    type: String,
    required: true,
  },
  userImage: String,
  text: {
    type: String,
    required: true,
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

const ContentSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true, // Clerk user ID
  },
  // Creator information
  creator: {
    name: {
      type: String,
      required: true,
    },
    image: String,
    bio: String,
    socialLinks: {
      twitter: String,
      github: String,
      website: String
    },
    creatorWallet: {
      type: String,
      required: true,
    }
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
  likes: [{
    userId: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  likesCount: {
    type: Number,
    default: 0
  },
  comments: [CommentSchema],
  commentsCount: {
    type: Number,
    default: 0
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

// Update timestamps
ContentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Update counts when likes/comments are modified
ContentSchema.pre('save', function(next) {
  if (this.isModified('likes')) {
    this.likesCount = this.likes.length;
  }
  if (this.isModified('comments')) {
    this.commentsCount = this.comments.length;
  }
  next();
});

export default mongoose.models.Content || mongoose.model('Content', ContentSchema); 