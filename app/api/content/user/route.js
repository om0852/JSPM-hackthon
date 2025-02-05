import { NextResponse } from 'next/server';
import connectDB from '../../../lib/mongodb';
import Content from '../../../models/Content';
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

        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get('page')) || 1;
        const limit = parseInt(searchParams.get('limit')) || 10;
        const filter = searchParams.get('filter') || 'all';

        await connectDB();

        // Build query
        let query = { userId: user.id };

        // Add published/draft filter
        if (filter === 'published') {
            query.isPublished = true;
        } else if (filter === 'draft') {
            query.isPublished = false;
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
                pages: Math.ceil(total / limit),
                hasMore: page * limit < total
            }
        });

    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({
            status: 'error',
            message: 'Error fetching user content',
            error: error.message
        }, { status: 500 });
    }
} 