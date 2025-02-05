import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/mongodb';
import Purchase from '../../../../models/Purchase';
import { currentUser } from '@clerk/nextjs/server';

// GET endpoint to check purchase status
export async function GET(req, { params }) {
    try {
        const { contentId } = params;
        const user = await currentUser();
        
        if (!user) {
            return NextResponse.json({ 
                status: 'error', 
                message: 'Unauthorized' 
            }, { status: 401 });
        }

        await connectDB();
        
        // Check if user has purchased this content
        const purchase = await Purchase.findOne({
            userId: user.id,
            contentId: contentId
        });

        return NextResponse.json({
            status: 'success',
            hasPurchased: !!purchase,
            data: purchase
        });

    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({
            status: 'error',
            message: 'Error checking purchase status',
            error: error.message
        }, { status: 500 });
    }
} 