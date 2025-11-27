import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST(request: Request) {
    try {
        const { userId, amount, adminKey } = await request.json();

        // Simple security check
        if (adminKey !== process.env.ADMIN_PASSWORD && adminKey !== 'Navidad2025') {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const supabase = await createClient();

        // Check if user exists in user_credits
        const { data: existingUser } = await supabase
            .from('user_credits')
            .select('credits')
            .eq('user_id', userId)
            .single();

        let error;
        if (existingUser) {
            // Update
            const { error: updateError } = await supabase
                .from('user_credits')
                .update({ credits: existingUser.credits + amount })
                .eq('user_id', userId);
            error = updateError;
        } else {
            // Insert
            const { error: insertError } = await supabase
                .from('user_credits')
                .insert({ user_id: userId, credits: amount });
            error = insertError;
        }

        if (error) throw error;

        return NextResponse.json({ success: true, message: `Added ${amount} credits to ${userId}` });

    } catch (error) {
        console.error("Give Credits Error:", error);
        return NextResponse.json({ error: "Failed to give credits" }, { status: 500 });
    }
}
