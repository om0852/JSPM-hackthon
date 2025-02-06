import { NextResponse } from 'next/server';
import connectDB from '../../lib/mongodb';
import Content from '../../models/Content';

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const query = searchParams.get('q');

        if (!query) {
            return NextResponse.json({
                status: 'error',
                message: 'Search query is required'
            }, { status: 400 });
        }

        await connectDB();

        // Create a text index for search (this is idempotent)
        await Content.collection.createIndex({
            title: 'text',
            description: 'text',
            'creator.name': 'text',
            categories: 'text'
        });

        // Perform the search
        const results = await Content.find(
            {
                $and: [
                    { isPublished: true },
                    {
                        $or: [
                            { $text: { $search: query } },
                            { title: { $regex: query, $options: 'i' } },
                            { description: { $regex: query, $options: 'i' } },
                            { 'creator.name': { $regex: query, $options: 'i' } },
                            { categories: { $regex: query, $options: 'i' } }
                        ]
                    }
                ]
            },
            {
                score: { $meta: 'textScore' },
                title: 1,
                contentType: 1,
                thumbnailURL: 1,
                'creator.name': 1,
                views: 1,
                likesCount: 1
            }
        )
        .sort({ score: { $meta: 'textScore' } })
        .limit(10)
        .lean();

        // Transform results
        const transformedResults = results.map(result => ({
            _id: result._id,
            title: result.title,
            type: result.contentType,
            thumbnail: result.thumbnailURL || '/placeholder-image.jpg',
            creator: result.creator?.name || 'Anonymous',
            stats: {
                views: result.views || 0,
                likes: result.likesCount || 0
            }
        }));

        return NextResponse.json({
            status: 'success',
            results: transformedResults
        });

    } catch (error) {
        console.error('Search API Error:', error);
        return NextResponse.json({
            status: 'error',
            message: 'Error performing search',
            error: error.message
        }, { status: 500 });
    }
} 