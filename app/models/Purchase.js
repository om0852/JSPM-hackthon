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
    creatorWallet: {
        type: String,
        required: true,
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
    contentType: {
        type: String,
        enum: ['article', 'video', 'course', 'image'],
        required: true,
    },
    subscriptionTier: {
        type: String,
        enum: ['free', 'basic', 'premium'],
        required: true,
    },
    status: {
        type: String,
        enum: ['completed', 'pending', 'failed'],
        default: 'completed',
    },
    purchaseDate: {
        type: Date,
        default: Date.now,
    },
    expiryDate: {
        type: Date,
        default: function() {
            // Set expiry to 1 year from purchase date
            const date = new Date();
            date.setFullYear(date.getFullYear() + 1);
            return date;
        }
    }
});

// Create compound index for user and content
PurchaseSchema.index({ userId: 1, contentId: 1 }, { unique: true });

// Create index on transactionHash
PurchaseSchema.index({ transactionHash: 1 }, { unique: true });

export default mongoose.models.Purchase || mongoose.model('Purchase', PurchaseSchema); 