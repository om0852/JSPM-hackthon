import { NextResponse } from 'next/server';
import connectDB from '../../../lib/mongodb';
import Content from '../../../models/Content';
import Purchase from '../../../models/Purchase';
import { currentUser } from '@clerk/nextjs/server';

// POST endpoint to record a new purchase
export async function POST(req) {
    try {
        const user = await currentUser();
        if (!user) {
            return NextResponse.json({ 
                status: 'error', 
                message: 'Unauthorized' 
            }, { status: 401 });
        }

        const { contentId, transactionHash } = await req.json();

        if (!contentId || !transactionHash) {
            return NextResponse.json({ 
                status: 'error', 
                message: 'Content ID and transaction hash are required' 
            }, { status: 400 });
        }

        await connectDB();

        // Verify content exists
        const content = await Content.findById(contentId);
        if (!content) {
            return NextResponse.json({ 
                status: 'error', 
                message: 'Content not found' 
            }, { status: 404 });
        }

        // Create purchase record
        const purchase = new Purchase({
            userId: user.id,
            contentId,
            transactionHash,
            amount: content.price,
            creatorId: content.userId
        });

        await purchase.save();

        return NextResponse.json({
            status: 'success',
            message: 'Purchase recorded successfully',
            data: purchase
        });

    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({
            status: 'error',
            message: 'Error recording purchase',
            error: error.message
        }, { status: 500 });
    }
}