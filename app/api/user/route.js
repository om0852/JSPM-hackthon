import { connectToDatabase } from '../../lib/mongodb';
import User from '../../models/User';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { email, username, metamaskAddress, userType } = body;
    
    await connectToDatabase();

    const userData = {
      clerkId: userId,
      email,
      username,
      metamaskAddress,
      userType,
      updatedAt: new Date()
    };

    const user = await User.findOneAndUpdate(
      { clerkId: userId },
      userData,
      { upsert: true, new: true, runValidators: true }
    ).lean();

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' }, 
      { status: 500 }
    );
  }
} 