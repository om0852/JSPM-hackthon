import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/mongodb';
import Content from '../../../../models/Content';
import { currentUser } from '@clerk/nextjs/server';

// Toggle like status
export async function POST(req, { params }) {
    try {
        const { id } = await params;
        const user = await currentUser();
        
        if (!user) {
            return NextResponse.json({ 
                status: 'error', 
                message: 'Unauthorized' 
            }, { status: 401 });
        }

        await connectDB();
        
        const content = await Content.findById(id);
        
        if (!content) {
            return NextResponse.json({ 
                status: 'error', 
                message: 'Content not found' 
            }, { status: 404 });
        }

        // Check if user has already liked
        const existingLike = content.likes.find(like => like.userId === user.id);
        
        if (existingLike) {
            // Unlike: Remove the like
            content.likes = content.likes.filter(like => like.userId !== user.id);
        } else {
            // Like: Add new like
            content.likes.push({
                userId: user.id,
                createdAt: new Date()
            });
        }

        await content.save();

        return NextResponse.json({
            status: 'success',
            message: existingLike ? 'Content unliked' : 'Content liked',
            likesCount: content.likesCount,
            isLiked: !existingLike
        });

    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({
            status: 'error',
            message: 'Error processing like',
            error: error.message
        }, { status: 500 });
    }
} 