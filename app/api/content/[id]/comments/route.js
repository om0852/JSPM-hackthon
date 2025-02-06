import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/mongodb';
import Content from '../../../../models/Content';
import { currentUser } from '@clerk/nextjs/server';
import mongoose from 'mongoose';

// Get comments for a content
export async function GET(req, { params }) {
    try {
        const { id } =await params;
        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get('page')) || 1;
        const limit = parseInt(searchParams.get('limit')) || 10;

        await connectDB();
        
        const content = await Content.findById(id);
        
        if (!content) {
            return NextResponse.json({ 
                status: 'error', 
                message: 'Content not found' 
            }, { status: 404 });
        }

        // Get paginated comments
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const comments = content.comments
            .sort((a, b) => b.createdAt - a.createdAt)
            .slice(startIndex, endIndex);

        return NextResponse.json({
            status: 'success',
            data: comments,
            pagination: {
                page,
                limit,
                total: content.comments.length,
                hasMore: endIndex < content.comments.length
            }
        });

    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({
            status: 'error',
            message: 'Error fetching comments',
            error: error.message
        }, { status: 500 });
    }
}

// Add a new comment
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

        const { text } = await req.json();

        if (!text?.trim()) {
            return NextResponse.json({ 
                status: 'error', 
                message: 'Comment text is required' 
            }, { status: 400 });
        }

        await connectDB();
        
        // Use findOneAndUpdate to avoid validation issues
        const content = await Content.findOneAndUpdate(
            { _id: id },
            {
                $push: {
                    comments: {
                        userId: user.id,
                        userName: `${user.firstName} ${user.lastName}`.trim() || 'Anonymous',
                        userImage: user.imageUrl,
                        text: text.trim(),
                        createdAt: new Date(),
                        updatedAt: new Date()
                    }
                },
                $inc: { commentsCount: 1 }
            },
            { new: true }
        );
        
        if (!content) {
            return NextResponse.json({ 
                status: 'error', 
                message: 'Content not found' 
            }, { status: 404 });
        }

        // Get the newly added comment
        const newComment = content.comments[content.comments.length - 1];

        return NextResponse.json({
            status: 'success',
            message: 'Comment added successfully',
            data: newComment
        });

    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({
            status: 'error',
            message: 'Error adding comment',
            error: error.message
        }, { status: 500 });
    }
}

// Delete a comment
export async function DELETE(req, { params }) {
    try {
        const { id } = await params;
        const { searchParams } = new URL(req.url);
        const commentId = searchParams.get('commentId');
        const user = await currentUser();
        
        if (!user) {
            return NextResponse.json({ 
                status: 'error', 
                message: 'Unauthorized' 
            }, { status: 401 });
        }

        if (!commentId) {
            return NextResponse.json({ 
                status: 'error', 
                message: 'Comment ID is required' 
            }, { status: 400 });
        }

        await connectDB();
        
        const content = await Content.findById(id);
        
        if (!content) {
            return NextResponse.json({ 
                status: 'error', 
                message: 'Content not found' 
            }, { status: 404 });
        }

        // Find the comment index
        const commentIndex = content.comments.findIndex(
            comment => comment._id.toString() === commentId
        );

        if (commentIndex === -1) {
            return NextResponse.json({ 
                status: 'error', 
                message: 'Comment not found' 
            }, { status: 404 });
        }

        // Check if user is authorized to delete the comment
        if (content.comments[commentIndex].userId !== user.id && content.userId !== user.id) {
            return NextResponse.json({ 
                status: 'error', 
                message: 'Unauthorized to delete this comment' 
            }, { status: 403 });
        }

        // Remove the comment
        content.comments.splice(commentIndex, 1);
        await content.save();

        return NextResponse.json({
            status: 'success',
            message: 'Comment deleted successfully'
        });

    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({
            status: 'error',
            message: 'Error deleting comment',
            error: error.message
        }, { status: 500 });
    }
} 