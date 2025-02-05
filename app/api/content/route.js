import { NextResponse } from 'next/server';
import connectDB from '../../lib/mongodb';
import Content from '../../models/Content';
import { currentUser } from '@clerk/nextjs/server';

export async function POST(req) {
    try {
        // Get the authenticated user's ID
        const user = await currentUser();
        if (!user) {
            return NextResponse.json({ 
                status: 'error', 
                message: 'Unauthorized' 
            }, { status: 401 });
        }

        // Connect to database
        await connectDB();

        // Parse the request body
        const data = await req.json();

        // Create new content with the user ID
        const content = new Content({
            ...data,
            userId: user.id
        });

        // Save the content
        await content.save();

        return NextResponse.json({
            status: 'success',
            message: 'Content saved successfully',
            data: content
        });

    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({
            status: 'error',
            message: 'Error saving content',
            error: error.message
        }, { status: 500 });
    }
}

export async function GET(req) {
    try {
        // Get the authenticated user's ID
        const user = await currentUser();
        if (!user) {
            return NextResponse.json({ 
                status: 'error', 
                message: 'Unauthorized' 
            }, { status: 401 });
        }

        // Connect to database
        await connectDB();

        // Get search parameters
        const { searchParams } = new URL(req.url);
        const contentType = searchParams.get('type');
        const page = parseInt(searchParams.get('page')) || 1;
        const limit = parseInt(searchParams.get('limit')) || 10;

        // Build query
        let query = { userId: user.id };
        if (contentType) {
            query.contentType = contentType;
        }

        // Get total count for pagination
        const total = await Content.countDocuments(query);

        // Get paginated content
        const contents = await Content.find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        return NextResponse.json({
            status: 'success',
            data: contents,
            pagination: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit)
            }
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