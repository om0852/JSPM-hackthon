import { NextResponse } from 'next/server';
import connectDB from '../../../lib/mongodb';
import Content from '../../../models/Content';
import Purchase from '../../../models/Purchase';
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

        // Get all content for the user
        const userContent = await Content.find({ userId: user.id });

        // Calculate total views
        const totalViews = userContent.reduce((sum, content) => sum + (content.views || 0), 0);

        // Get all purchases for user's content
        const contentIds = userContent.map(content => content._id);
        const purchases = await Purchase.find({
            contentId: { $in: contentIds },
            status: 'completed'
        });

        // Calculate total earnings from purchases
        const totalEarnings = purchases.reduce((sum, purchase) => sum + (purchase.amount || 0), 0);

        // Get content count
        const contentCount = userContent.length;

        // Get recent activity (last 5 pieces of content)
        const recentActivity = await Content.find({ userId: user.id })
            .sort({ createdAt: -1 })
            .limit(5)
            .select({
                title: 1,
                contentType: 1,
                views: 1,
                likesCount: 1,
                commentsCount: 1,
                createdAt: 1,
                isPublished: 1,
                price: 1,
                purchases: 1
            });

        return NextResponse.json({
            status: 'success',
            data: {
                totalViews,
                totalEarnings,
                contentCount,
                recentActivity
            }
        });

    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({
            status: 'error',
            message: 'Error fetching dashboard stats',
            error: error.message
        }, { status: 500 });
    }
} 