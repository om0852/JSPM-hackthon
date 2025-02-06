import { NextResponse } from 'next/server';
import connectDB from '../../lib/mongodb';
import User from '../../models/User';
import { currentUser } from '@clerk/nextjs/server';
import { cookies } from 'next/headers';

export async function POST(req) {
    try {
        const user = await currentUser();
        
        if (!user) {
            return NextResponse.json({ 
                status: 'error', 
                message: 'Unauthorized' 
            }, { status: 401 });
        }

        const { walletAddress, userType } = await req.json();

        if (!walletAddress || !userType) {
            return NextResponse.json({ 
                status: 'error', 
                message: 'Wallet address and user type are required' 
            }, { status: 400 });
        }

        await connectDB();

        // Check if wallet address is already used
        const existingWallet = await User.findOne({ walletAddress });
        if (existingWallet && existingWallet.userId !== user.id) {
            return NextResponse.json({ 
                status: 'error', 
                message: 'This wallet address is already associated with another account' 
            }, { status: 400 });
        }

        // Update or create user in our database
        const userData = {
            userId: user.id,
            email: user.emailAddresses[0].emailAddress,
            firstName: user.firstName,
            lastName: user.lastName,
            profileImage: user.imageUrl,
            walletAddress,
            userType,
            isVerified: true
        };

        await User.findOneAndUpdate(
            { userId: user.id },
            userData,
            { upsert: true, new: true }
        );

        // Update user's public metadata using Clerk
        await fetch(`https://api.clerk.dev/v1/users/${user.id}/metadata`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${process.env.CLERK_SECRET_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                publicMetadata: {
                    walletAddress,
                    userType,
                    isVerified: true
                }
            })
        });

        // Create response with cookie
        const response = NextResponse.json({
            status: 'success',
            message: 'User verified successfully',
            data: userData
        });

        // Set verification cookie
        response.cookies.set('isVerified', 'true', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 30 * 24 * 60 * 60 // 30 days
        });

        response.cookies.set('userType', userType, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 30 * 24 * 60 * 60 // 30 days
        });

        return response;

    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({
            status: 'error',
            message: 'Error verifying user',
            error: error.message
        }, { status: 500 });
    }
}

// GET endpoint to check verification status
export async function GET(req) {
    try {
        // Get headers before any async operations
        const cookieStore = cookies();
        
        const user = await currentUser();
        
        if (!user) {
            return NextResponse.json({ 
                status: 'error', 
                message: 'Unauthorized' 
            }, { status: 401 });
        }

        await connectDB();

        const userData = await User.findOne({ userId: user.id });
        
        const response = NextResponse.json({
            status: 'success',
            data: {
                isVerified: userData?.isVerified || false,
                userType: userData?.userType,
                walletAddress: userData?.walletAddress
            }
        });

        // Update cookies based on verification status
        if (userData?.isVerified) {
            response.cookies.set('isVerified', 'true', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 30 * 24 * 60 * 60 // 30 days
            });
            response.cookies.set('userType', userData.userType, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 30 * 24 * 60 * 60 // 30 days
            });
        }

        return response;

    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({
            status: 'error',
            message: 'Error checking verification status',
            error: error.message
        }, { status: 500 });
    }
} 