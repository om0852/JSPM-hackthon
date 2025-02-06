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

        // Get recent content (last 10 items)
        const recentContent = await Content.find({ userId: user.id })
            .sort({ createdAt: -1 })
            .limit(10)
            .select({
                title: 1,
                contentType: 1,
                views: 1,
                likesCount: 1,
                commentsCount: 1,
                createdAt: 1,
                isPublished: 1,
                price: 1,
                likes: { $slice: -10 }, // Get last 10 likes
                comments: { $slice: -10 } // Get last 10 comments
            });

        // Get recent purchases (last 10)
        const recentPurchases = await Purchase.find({
            contentId: { $in: contentIds },
            status: 'completed'
        })
        .sort({ purchaseDate: -1 })
        .limit(10)
        .populate('contentId', 'title');

        // Combine and format all activities
        let recentActivity = [];

        // Add content creation activities
        recentContent.forEach(content => {
            // Add content creation
            recentActivity.push({
                type: 'content',
                action: 'created',
                title: content.title,
                contentType: content.contentType,
                isPublished: content.isPublished,
                date: content.createdAt,
                stats: {
                    views: content.views || 0,
                    likes: content.likesCount || 0,
                    comments: content.commentsCount || 0
                }
            });

            // Add recent likes (in reverse order to show latest first)
            content.likes?.reverse().forEach(like => {
                recentActivity.push({
                    type: 'like',
                    action: 'liked',
                    title: content.title,
                    contentType: content.contentType,
                    date: like.createdAt,
                    userId: like.userId
                });
            });

            // Add recent comments (in reverse order to show latest first)
            content.comments?.reverse().forEach(comment => {
                recentActivity.push({
                    type: 'comment',
                    action: 'commented',
                    title: content.title,
                    contentType: content.contentType,
                    date: comment.createdAt,
                    userId: comment.userId,
                    userName: comment.userName,
                    comment: comment.text
                });
            });
        });

        // Add purchase activities
        recentPurchases.forEach(purchase => {
            recentActivity.push({
                type: 'purchase',
                action: 'purchased',
                title: purchase.contentId?.title || 'Unknown Content',
                contentType: purchase.contentType,
                date: purchase.purchaseDate,
                amount: purchase.amount,
                userId: purchase.userId
            });
        });

        // Sort all activities by date (most recent first) and limit to 15
        recentActivity.sort((a, b) => new Date(b.date) - new Date(a.date));
        recentActivity = recentActivity.slice(0, 15);

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