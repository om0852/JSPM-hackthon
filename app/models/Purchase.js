import mongoose from 'mongoose';

const PurchaseSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true, // Clerk user ID
    },
    contentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Content',
        required: true,
    },
    creatorId: {
        type: String,
        required: true, // Clerk user ID of content creator
    },
    transactionHash: {
        type: String,
        required: true,
        unique: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['completed', 'pending', 'failed'],
        default: 'completed',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

// Create compound index for user and content
PurchaseSchema.index({ userId: 1, contentId: 1 }, { unique: true });

export default mongoose.models.Purchase || mongoose.model('Purchase', PurchaseSchema); 