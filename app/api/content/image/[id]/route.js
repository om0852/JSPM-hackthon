import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/mongodb';
import Content from '../../../../models/Content';
import { currentUser } from '@clerk/nextjs/server';

export async function GET(req, { params }) {
    try {
        const { id } = await params;
        const user = await currentUser();
        await connectDB();
        
        // Find image and select specific fields
        const image = await Content.findOne({ 
            _id: id,
            contentType: 'image',
            isPublished: true 
        }).select({
            title: 1,
            description: 1,
            thumbnailURL: 1,
            contentURL: 1,
            views: 1,
            likesCount: 1,
            commentsCount: 1,
            downloads: 1,
            categories: 1,
            'creator.name': 1,
            'creator.image': 1,
            'creator.bio': 1,
            'creator.socialLinks': 1,
            createdAt: 1,
            likes: 1
        }).lean();
        
        if (!image) {
            return NextResponse.json({ 
                status: 'error', 
                message: 'Image not found' 
            }, { status: 404 });
        }

        // Increment views using updateOne to avoid validation
        await Content.updateOne(
            { _id: id },
            { $inc: { views: 1 } }
        );

        // Add isLiked status and transform data
        const transformedImage = {
            ...image,
            views: (image.views || 0) + 1, // Increment the view in response
            likesCount: image.likesCount || 0,
            commentsCount: image.commentsCount || 0,
            downloads: image.downloads || 0,
            isLiked: user ? (image.likes || []).some(like => like.userId === user.id) : false,
            creator: {
                name: image.creator?.name || 'Anonymous',
                image: image.creator?.image || '/placeholder-user.jpg',
                bio: image.creator?.bio || '',
                socialLinks: image.creator?.socialLinks || {}
            }
        };

        // Remove likes array from response to reduce payload size
        delete transformedImage.likes;

        return NextResponse.json({
            status: 'success',
            data: transformedImage
        });

    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({
            status: 'error',
            message: 'Error fetching image',
            error: error.message
        }, { status: 500 });
    }
} 