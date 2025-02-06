import { NextResponse } from 'next/server';
import connectDB from '../../../lib/mongodb';
import Purchase from '../../../models/Purchase';
import { currentUser } from '@clerk/nextjs/server';

export async function GET(req) {
    try {
        const user = await currentUser();
        
        if (!user) {
            return NextResponse.json({ 
                status: 'error', 
                message: 'Unauthorized' 
            }, { status: 401 });
        }

        await connectDB();

        // Get current date ranges
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        
        const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
        
        const thisYear = new Date(now.getFullYear(), 0, 1);
        const lastYear = new Date(now.getFullYear() - 1, 0, 1);
        const nextYear = new Date(now.getFullYear() + 1, 0, 1);

        // Get earnings for different time periods
        const [
            todayEarnings,
            yesterdayEarnings,
            thisMonthEarnings,
            lastMonthEarnings,
            thisYearEarnings,
            lastYearEarnings,
            contentEarnings
        ] = await Promise.all([
            // Today's earnings
            Purchase.aggregate([
                {
                    $match: {
                        creatorId: user.id,
                        purchaseDate: { $gte: today, $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000) }
                    }
                },
                {
                    $group: {
                        _id: null,
                        total: { $sum: "$amount" }
                    }
                }
            ]),

            // Yesterday's earnings
            Purchase.aggregate([
                {
                    $match: {
                        creatorId: user.id,
                        purchaseDate: { $gte: yesterday, $lt: today }
                    }
                },
                {
                    $group: {
                        _id: null,
                        total: { $sum: "$amount" }
                    }
                }
            ]),

            // This month's earnings
            Purchase.aggregate([
                {
                    $match: {
                        creatorId: user.id,
                        purchaseDate: { $gte: thisMonth, $lt: nextMonth }
                    }
                },
                {
                    $group: {
                        _id: null,
                        total: { $sum: "$amount" }
                    }
                }
            ]),

            // Last month's earnings
            Purchase.aggregate([
                {
                    $match: {
                        creatorId: user.id,
                        purchaseDate: { $gte: lastMonth, $lt: thisMonth }
                    }
                },
                {
                    $group: {
                        _id: null,
                        total: { $sum: "$amount" }
                    }
                }
            ]),

            // This year's earnings
            Purchase.aggregate([
                {
                    $match: {
                        creatorId: user.id,
                        purchaseDate: { $gte: thisYear, $lt: nextYear }
                    }
                },
                {
                    $group: {
                        _id: null,
                        total: { $sum: "$amount" }
                    }
                }
            ]),

            // Last year's earnings
            Purchase.aggregate([
                {
                    $match: {
                        creatorId: user.id,
                        purchaseDate: { $gte: lastYear, $lt: thisYear }
                    }
                },
                {
                    $group: {
                        _id: null,
                        total: { $sum: "$amount" }
                    }
                }
            ]),

            // Content-wise earnings
            Purchase.aggregate([
                {
                    $match: {
                        creatorId: user.id
                    }
                },
                {
                    $group: {
                        _id: "$contentId",
                        totalEarnings: { $sum: "$amount" },
                        totalPurchases: { $sum: 1 },
                        lastPurchaseDate: { $max: "$purchaseDate" }
                    }
                },
                {
                    $lookup: {
                        from: "contents",
                        localField: "_id",
                        foreignField: "_id",
                        as: "content"
                    }
                },
                {
                    $unwind: "$content"
                },
                {
                    $project: {
                        _id: 1,
                        title: "$content.title",
                        thumbnailURL: "$content.thumbnailURL",
                        contentType: "$content.contentType",
                        totalEarnings: 1,
                        totalPurchases: 1,
                        lastPurchaseDate: 1
                    }
                },
                {
                    $sort: { totalEarnings: -1 }
                }
            ])
        ]);

        return NextResponse.json({
            status: 'success',
            earnings: {
                today: todayEarnings[0]?.total || 0,
                yesterday: yesterdayEarnings[0]?.total || 0,
                thisMonth: thisMonthEarnings[0]?.total || 0,
                lastMonth: lastMonthEarnings[0]?.total || 0,
                thisYear: thisYearEarnings[0]?.total || 0,
                lastYear: lastYearEarnings[0]?.total || 0
            },
            contentEarnings
        });

    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({
            status: 'error',
            message: 'Error fetching earnings',
            error: error.message
        }, { status: 500 });
    }
} 