import { NextResponse } from 'next/server';
import connectDB from '../../../../../../lib/mongodb';
import Content from '../../../../../../models/Content';
import { currentUser } from '@clerk/nextjs/server';

// Toggle like on a comment
export async function POST(req, { params }) {
  try {
    const { id, commentId } = params;
    const user = await currentUser();
    
    if (!user) {
      return NextResponse.json({ 
        status: 'error', 
        message: 'Unauthorized' 
      }, { status: 401 });
    }

    await connectDB();
    
    const content = await Content.findById(id);
    
    if (!content) {
      return NextResponse.json({ 
        status: 'error', 
        message: 'Content not found' 
      }, { status: 404 });
    }

    const comment = content.comments.id(commentId);

    if (!comment) {
      return NextResponse.json({ 
        status: 'error', 
        message: 'Comment not found' 
      }, { status: 404 });
    }

    const existingLike = comment.likes.find(like => like.userId === user.id);

    if (existingLike) {
      // Unlike
      comment.likes = comment.likes.filter(like => like.userId !== user.id);
      comment.likesCount = comment.likes.length;
    } else {
      // Like
      comment.likes.push({
        userId: user.id,
        createdAt: new Date()
      });
      comment.likesCount = comment.likes.length;
    }

    await content.save();

    return NextResponse.json({
      status: 'success',
      message: existingLike ? 'Comment unliked' : 'Comment liked',
      likesCount: comment.likesCount,
      isLiked: !existingLike
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({
      status: 'error',
      message: 'Error toggling comment like',
      error: error.message
    }, { status: 500 });
  }
}