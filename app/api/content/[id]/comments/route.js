import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/mongodb';
import Content from '../../../../models/Content';
import { currentUser } from '@clerk/nextjs/server';
import mongoose from 'mongoose';

// Get comments for a content
export async function GET(req, { params }) {
    try {
        const { id } = await params;
        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get('page')) || 1;
        const limit = parseInt(searchParams.get('limit')) || 10;

        await connectDB();
        
        const content = await Content.findById(id).lean();
        
        if (!content) {
            return NextResponse.json({ 
                status: 'error', 
                message: 'Content not found' 
            }, { status: 404 });
        }

        // Sort comments by createdAt in descending order and paginate
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const totalComments = content.comments?.length || 0;

        const paginatedComments = (content.comments || [])
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(startIndex, endIndex);

        // Add isLiked status for the current user
        const user = await currentUser();
        const commentsWithLikeStatus = paginatedComments.map(comment => ({
            ...comment,
            isLiked: user ? comment.likes?.some(like => like.userId === user.id) : false
        }));

        return NextResponse.json({
            status: 'success',
            data: commentsWithLikeStatus,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(totalComments / limit),
                hasMore: endIndex < totalComments
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

        if (!text || !text.trim()) {
            return NextResponse.json({ 
                status: 'error', 
                message: 'Comment text is required' 
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

        // Create a new comment
        const newComment = {
            _id: new mongoose.Types.ObjectId(),
            userId: user.id,
            userName: `${user.firstName} ${user.lastName}`,
            userImage: user.imageUrl,
            text: text.trim(),
            createdAt: new Date(),
            updatedAt: new Date(),
            likes: [],
            likesCount: 0
        };

        // Add the comment to the beginning of the comments array
        content.comments.unshift(newComment);
        await content.save();

        return NextResponse.json({
            status: 'success',
            message: 'Comment added successfully',
            data: {
                ...newComment,
                isLiked: false
            }
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