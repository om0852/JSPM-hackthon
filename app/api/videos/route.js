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

        // Build query for videos only
        let query = { 
            contentType: 'video',
            isPublished: true
        };

        // Add category filter if specified
        if (category && category !== 'All') {
            query.categories = category;
        }

        // Get total count for pagination
        const total = await Content.countDocuments(query);

        // Get paginated videos with specific field selection
        const videos = await Content.find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .select({
                title: 1,
                thumbnailURL: 1,
                views: 1,
                likesCount: 1,
                commentsCount: 1,
                duration: 1,
                categories: 1,
                'creator.name': 1,
                contentURL: 1,
                createdAt: 1
            })
            .lean(); // Convert to plain JavaScript objects

        // Transform the data to ensure all required fields have default values
        const transformedVideos = videos.map(video => ({
            ...video,
            views: video.views || 0,
            likesCount: video.likesCount || 0,
            commentsCount: video.commentsCount || 0,
            creator: {
                name: video.creator?.name || 'Anonymous',
                ...video.creator
            },
            thumbnailURL: video.thumbnailURL || '/placeholder-video.jpg'
        }));

        return NextResponse.json({
            status: 'success',
            data: transformedVideos,
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
            message: 'Error fetching videos',
            error: error.message
        }, { status: 500 });
    }
} 