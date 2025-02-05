import { NextResponse } from 'next/server';
import connectDB from '../../../lib/mongodb';
import Content from '../../../models/Content';
import { currentUser } from '@clerk/nextjs/server';

// Get single content
export async function GET(req, { params }) {
    try {
        const { id } =await params;
        await connectDB();
        
        // Find content and select all fields
        const content = await Content.findById(id).lean();
        console.log(content);
        if (!content) {
            return NextResponse.json({ 
                status: 'error', 
                message: 'Content not found' 
            }, { status: 404 });
        }

        // Increment views using updateOne to avoid validation
        await Content.updateOne(
            { _id: id },
            { $inc: { views: 1 } }
        );

        // Add default values for required fields if they don't exist
        const transformedContent = {
            ...content,
            views: (content.views || 0) + 1, // Increment the view in response
            creator: {
                name: content.creator?.name || 'Anonymous',
                creatorWallet: content.creator?.creatorWallet || '0x0000000000000000000000000000000000000000',
                ...content.creator
            },
            likesCount: content.likesCount || 0,
            commentsCount: content.commentsCount || 0
        };

        return NextResponse.json({
            status: 'success',
            data: transformedContent
        });

    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({
            status: 'error',
            message: 'Error fetching content',
            error: error.message
        }, { status: 500 });
    }
}

// Update content
export async function PUT(req, { params }) {
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
        
        const updateData = await req.json();
        
        const content = await Content.findOneAndUpdate(
            { _id: id, userId: user.id },
            { ...updateData, updatedAt: Date.now() },
            { new: true, runValidators: true }
        );
        
        if (!content) {
            return NextResponse.json({ 
                status: 'error', 
                message: 'Content not found or unauthorized' 
            }, { status: 404 });
        }

        return NextResponse.json({
            status: 'success',
            message: 'Content updated successfully',
            data: content
        });

    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({
            status: 'error',
            message: 'Error updating content',
            error: error.message
        }, { status: 500 });
    }
}

// Delete content
export async function DELETE(req, { params }) {
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
        
        const content = await Content.findOneAndDelete({ _id: id, userId: user.id });
        
        if (!content) {
            return NextResponse.json({ 
                status: 'error', 
                message: 'Content not found or unauthorized' 
            }, { status: 404 });
        }

        return NextResponse.json({
            status: 'success',
            message: 'Content deleted successfully'
        });

    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({
            status: 'error',
            message: 'Error deleting content',
            error: error.message
        }, { status: 500 });
    }
} 