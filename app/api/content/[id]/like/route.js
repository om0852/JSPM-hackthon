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
        
        // Find content without lean() to get a mongoose document
        const content = await Content.findById(id);
        
        if (!content) {
            return NextResponse.json({ 
                status: 'error', 
                message: 'Content not found' 
            }, { status: 404 });
        }

        // Check if user has already liked
        const existingLikeIndex = content.likes.findIndex(like => like.userId === user.id);
        
        if (existingLikeIndex !== -1) {
            // Unlike: Remove the like
            content.likes.splice(existingLikeIndex, 1);
            // Update likesCount
            content.likesCount = content.likes.length;
            // Save with validation disabled for this operation
            await content.save({ validateBeforeSave: false });

            return NextResponse.json({
                status: 'success',
                message: 'Content unliked successfully',
                likesCount: content.likesCount,
                isLiked: false
            });
        } else {
            // Like: Add new like
            content.likes.push({
                userId: user.id,
                createdAt: new Date()
            });
            // Update likesCount
            content.likesCount = content.likes.length;
            // Save with validation disabled for this operation
            await content.save({ validateBeforeSave: false });

            return NextResponse.json({
                status: 'success',
                message: 'Content liked successfully',
                likesCount: content.likesCount,
                isLiked: true
            });
        }

    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({
            status: 'error',
            message: 'Error processing like',
            error: error.message
        }, { status: 500 });
    }
} 