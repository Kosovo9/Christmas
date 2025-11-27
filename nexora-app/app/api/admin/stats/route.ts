import { NextResponse } from 'next/server';

export async function GET() {
    // Mock data for the admin dashboard
    const stats = {
        totalUsers: 12543,
        activeNow: 42,
        revenue: 45230.50,
        conversionRate: 4.8
    };

    return NextResponse.json(stats);
}
