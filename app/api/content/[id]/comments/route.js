import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/mongodb';
import Content from '../../../../models/Content';
import { currentUser } from '@clerk/nextjs/server';

// Get comments for a content
export async function GET(req, { params }) {
    try {
        const { id } = params;
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
                total: content.commentsCount,
                page,
                limit,
                pages: Math.ceil(content.commentsCount / limit),
                hasMore: endIndex < content.commentsCount
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
        const { id } = params;
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

        const { text } = await req.json();

        if (!text?.trim()) {
            return NextResponse.json({ 
                status: 'error', 
                message: 'Comment text is required' 
            }, { status: 400 });
        }

        const newComment = {
            userId: user.id,
            userName: `${user.firstName} ${user.lastName}`,
            userImage: user.imageUrl,
            text: text.trim(),
            createdAt: new Date(),
            updatedAt: new Date()
        };

        content.comments.push(newComment);
        await content.save();

        return NextResponse.json({
            status: 'success',
            message: 'Comment added successfully',
            data: newComment,
            commentsCount: content.commentsCount
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
        const { id } = params;
        const { searchParams } = new URL(req.url);
        const commentId = searchParams.get('commentId');
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

        const comment = content.comments.id(commentId);

        if (!comment) {
            return NextResponse.json({ 
                status: 'error', 
                message: 'Comment not found' 
            }, { status: 404 });
        }

        // Only allow comment owner or content owner to delete
        if (comment.userId !== user.id && content.userId !== user.id) {
            return NextResponse.json({ 
                status: 'error', 
                message: 'Unauthorized to delete this comment' 
            }, { status: 403 });
        }

        comment.remove();
        await content.save();

        return NextResponse.json({
            status: 'success',
            message: 'Comment deleted successfully',
            commentsCount: content.commentsCount
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