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

        // Build query for courses only
        let query = { 
            contentType: 'course',
            isPublished: true
        };

        // Add category filter if specified
        if (category && category !== 'All') {
            query.categories = category;
        }

        // Get total count for pagination
        const total = await Content.countDocuments(query);

        // Get paginated courses with specific field selection
        const courses = await Content.find(query)
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
                price: 1,
                rating: 1,
                students: 1,
                createdAt: 1
            })
            .lean();

        // Transform the data to ensure all required fields have default values
        const transformedCourses = courses.map(course => ({
            ...course,
            views: course.views || 0,
            likesCount: course.likesCount || 0,
            commentsCount: course.commentsCount || 0,
            students: course.students || 0,
            rating: course.rating || '0.0',
            creator: {
                name: course.creator?.name || 'Anonymous',
                ...course.creator
            },
            thumbnailURL: course.thumbnailURL || '/placeholder-course.jpg'
        }));

        return NextResponse.json({
            status: 'success',
            data: transformedCourses,
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
            message: 'Error fetching courses',
            error: error.message
        }, { status: 500 });
    }
} 