import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const supabase = await createClient();

        // 1. Total Revenue (Sum of completed transactions)
        const { data: transactions, error: txError } = await supabase
            .from('transactions')
            .select('amount, created_at')
            .eq('status', 'completed');

        if (txError) throw txError;

        const totalRevenue = transactions?.reduce((sum, tx) => sum + (Number(tx.amount) || 0), 0) || 0;

        // 2. Total Users (Count of user_credits entries as proxy for active users)
        const { count: totalUsers, error: userError } = await supabase
            .from('user_credits')
            .select('*', { count: 'exact', head: true });

        if (userError) throw userError;

        // 3. Total Generated Images
        const { count: totalImages, error: imgError } = await supabase
            .from('generated_images')
            .select('*', { count: 'exact', head: true });

        if (imgError) throw imgError;

        // 4. Recent Activity (Last 5 transactions)
        const { data: recentSales } = await supabase
            .from('transactions')
            .select('*')
            .eq('status', 'completed')
            .order('created_at', { ascending: false })
            .limit(5);

        // 5. Recent Images (Last 5)
        const { data: recentImages } = await supabase
            .from('generated_images')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(6);

        return NextResponse.json({
            stats: {
                revenue: totalRevenue,
                users: totalUsers || 0,
                images: totalImages || 0,
                conversionRate: totalUsers ? ((transactions?.length || 0) / totalUsers * 100).toFixed(1) : 0
            },
            recentSales: recentSales || [],
            recentImages: recentImages || [],
            chartData: transactions?.map(tx => ({
                date: new Date(tx.created_at).toLocaleDateString(),
                amount: tx.amount
            })) || []
        });

    } catch (error) {
        console.error("Admin Stats Error:", error);
        return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
    }
}
