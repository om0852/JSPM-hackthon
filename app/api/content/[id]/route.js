import { NextResponse } from 'next/server';
import connectDB from '../../../lib/mongodb';
import Content from '../../../models/Content';
import { currentUser } from '@clerk/nextjs/server';

// Get single content
export async function GET(req, { params }) {
    try {
        const { id } = params;
        await connectDB();
        
        const content = await Content.findById(id);
        
        if (!content) {
            return NextResponse.json({ 
                status: 'error', 
                message: 'Content not found' 
            }, { status: 404 });
        }

        // Increment views
        content.views += 1;
        await content.save();

        return NextResponse.json({
            status: 'success',
            data: content
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
        const { id } = params;
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
        const { id } = params;
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