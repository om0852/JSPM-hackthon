import mongoose from 'mongoose';
import { NextResponse } from 'next/server';
import connectDB from '../lib/mongodb';
// import { auth } from '@clerk/nextjs';


export async function GET(req) {
    try {
        // Check authentication
        // const { userId } = auth();
        let userId="100"
        // Connect to database
        await connectDB();
        const { readyState } = mongoose.connection;
        
        const states = {
            0: 'disconnected',
            1: 'connected',
            2: 'connecting',
            3: 'disconnecting'
        };
        
        const status = states[readyState] || 'unknown';
        const data = await mongoose.connection.db.collection('users').find({}).toArray();
        console.log(data)
        return NextResponse.json({
            status: 'success',
            message: `Database connection status: ${status}`,
            isConnected: readyState === 1,
            userId: userId,
            data: data
        });

    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({
            status: 'error',
            message: 'Error checking connection',
            error: error.message
        }, { status: 500 });
    }
}