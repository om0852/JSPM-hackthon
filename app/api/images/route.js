import { NextResponse } from 'next/server';
import connectDB from '../../lib/mongodb';
import Content from '../../models/Content';

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get('page')) || 1;
        const limit = parseInt(searchParams.get('limit')) || 12;
        const category = searchParams.get('category');

        await connectDB();

        // Build query for images only
        let query = { 
            contentType: 'image',
            isPublished: true
        };

        // Add category filter if specified
        if (category && category !== 'All') {
            query.categories = category;
        }

        // Get total count for pagination
        const total = await Content.countDocuments(query);

        // Get paginated images with specific field selection
        const images = await Content.find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .select({
                title: 1,
                thumbnailURL: 1,
                contentURL: 1,
                views: 1,
                likesCount: 1,
                downloads: 1,
                categories: 1,
                'creator.name': 1,
                createdAt: 1
            })
            .lean();

        // Transform the data to ensure all required fields have default values
        const transformedImages = images.map(image => ({
            ...image,
            views: image.views || 0,
            likesCount: image.likesCount || 0,
            downloads: image.downloads || 0,
            creator: {
                name: image.creator?.name || 'Anonymous',
                ...image.creator
            },
            thumbnailURL: image.thumbnailURL || image.contentURL || '/placeholder-image.jpg'
        }));

        return NextResponse.json({
            status: 'success',
            data: transformedImages,
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
            message: 'Error fetching images',
            error: error.message
        }, { status: 500 });
    }
} 