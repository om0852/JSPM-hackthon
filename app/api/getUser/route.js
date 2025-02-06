import { NextResponse } from 'next/server';
import User from '../../models/User';
import connectDB from '../../lib/mongodb';


export async function GET(req) {
  // Extract userId from query parameters
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');
console.log(userId,"welcome")
  // Validate userId
  if (!userId) {
    return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
  }

  try {
    await connectDB();

    // Fetch user data from the database
    const user = await User.findOne({ _id: userId });

    // Check if user exists
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Return user data
    return NextResponse.json({ data: user }, { status: 200 });
  } catch (error) {
    console.error('Error fetching user data:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
} 