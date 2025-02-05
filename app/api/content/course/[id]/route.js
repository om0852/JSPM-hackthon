import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/mongodb';
import Content from '../../../../models/Content';
import { currentUser } from '@clerk/nextjs/server';

export async function GET(req, { params }) {
    try {
        const { id } = await params;
        const user = await currentUser();
        await connectDB();
        
        // Find course and select specific fields
        const course = await Content.findOne({ 
            _id: id,
            contentType: 'course',
            isPublished: true 
        }).select({
            title: 1,
            description: 1,
            thumbnailURL: 1,
            contentURL: 1,
            views: 1,
            likesCount: 1,
            commentsCount: 1,
            categories: 1,
            'creator.name': 1,
            'creator.image': 1,
            'creator.bio': 1,
            'creator.socialLinks': 1,
            price: 1,
            duration: 1,
            students: 1,
            rating: 1,
            curriculum: 1,
            requirements: 1,
            objectives: 1,
            createdAt: 1,
            likes: 1
        }).lean();
        
        if (!course) {
            return NextResponse.json({ 
                status: 'error', 
                message: 'Course not found' 
            }, { status: 404 });
        }

        // Increment views using updateOne to avoid validation
        await Content.updateOne(
            { _id: id },
            { $inc: { views: 1 } }
        );

        // Add isLiked status and transform data
        const transformedCourse = {
            ...course,
            views: (course.views || 0) + 1, // Increment the view in response
            likesCount: course.likesCount || 0,
            commentsCount: course.commentsCount || 0,
            students: course.students || 0,
            rating: course.rating || '0.0',
            isLiked: user ? (course.likes || []).some(like => like.userId === user.id) : false,
            creator: {
                name: course.creator?.name || 'Anonymous',
                image: course.creator?.image || '/placeholder-user.jpg',
                bio: course.creator?.bio || '',
                socialLinks: course.creator?.socialLinks || {}
            },
            curriculum: course.curriculum || [],
            requirements: course.requirements || [],
            objectives: course.objectives || []
        };

        // Remove likes array from response to reduce payload size
        delete transformedCourse.likes;

        return NextResponse.json({
            status: 'success',
            data: transformedCourse
        });

    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({
            status: 'error',
            message: 'Error fetching course',
            error: error.message
        }, { status: 500 });
    }
} 