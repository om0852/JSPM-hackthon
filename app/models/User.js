import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  clerkId: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  username: { type: String },
  metamaskAddress: { type: String },
  userType: { 
    type: String, 
    enum: ['creator', 'viewer'], 
    default: 'viewer' 
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.models.User || mongoose.model('User', UserSchema); 