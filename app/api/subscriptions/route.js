import { NextResponse } from 'next/server';
import connectDB from '../../lib/mongodb';
import Purchase from '../../models/Purchase';
import Content from '../../models/Content';
import { currentUser } from '@clerk/nextjs/server';

export async function GET(req) {
    try {
        const user = await currentUser();
        if (!user) {
            return NextResponse.json({ 
                status: 'error', 
                message: 'Unauthorized' 
            }, { status: 401 });
        }

        await connectDB();

        // Get all purchases for the user
        const purchases = await Purchase.find({ userId: user.id });

        // Get content details for each purchase
        const subscriptions = await Promise.all(
            purchases.map(async (purchase) => {
                const content = await Content.findById(purchase.contentId);
                if (!content) return null;

                return {
                    id: content._id,
                    title: content.title,
                    thumbnail: content.thumbnailURL || '/placeholder-image.jpg',
                    provider: content.creator?.name || 'Anonymous',
                    subscriptionDate: purchase.createdAt,
                    renewalDate: new Date(purchase.createdAt.getTime() + 365 * 24 * 60 * 60 * 1000), // 1 year from purchase
                    tier: content.subscriptionTier,
                    cost: `$${content.price}/month`,
                    type: content.contentType,
                    totalContent: content.totalContent || '1 item',
                    transactionHash: purchase.transactionHash
                };
            })
        );

        // Filter out null values (in case content was deleted)
        const validSubscriptions = subscriptions.filter(sub => sub !== null);

        return NextResponse.json({
            status: 'success',
            data: validSubscriptions
        });

    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({
            status: 'error',
            message: 'Error fetching subscriptions',
            error: error.message
        }, { status: 500 });
    }
} 