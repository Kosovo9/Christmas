import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST(request: Request) {
    try {
        const { email, name, source } = await request.json();

        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
            return NextResponse.json({
                error: 'Invalid email address'
            }, { status: 400 });
        }

        const supabase = await createClient();

        // Check if email already exists
        const { data: existing } = await supabase
            .from('newsletter_subscribers')
            .select('email')
            .eq('email', email.toLowerCase())
            .single();

        if (existing) {
            return NextResponse.json({
                success: true,
                message: 'You are already subscribed!',
                alreadySubscribed: true
            });
        }

        // Insert new subscriber
        const { error: insertError } = await supabase
            .from('newsletter_subscribers')
            .insert({
                email: email.toLowerCase(),
                name: name || null,
                source: source || 'website',
                subscribed_at: new Date().toISOString(),
                is_active: true
            });

        if (insertError) {
            console.error('Newsletter subscription error:', insertError);
            return NextResponse.json({
                error: 'Failed to subscribe. Please try again.'
            }, { status: 500 });
        }

        // TODO: Send welcome email via Resend/SendGrid (optional)
        // await sendWelcomeEmail(email, name);

        console.log(`✅ New newsletter subscriber: ${email}`);

        return NextResponse.json({
            success: true,
            message: 'Successfully subscribed to newsletter!'
        });
    } catch (error) {
        console.error('Newsletter error:', error);
        return NextResponse.json({
            error: 'Subscription failed',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}

