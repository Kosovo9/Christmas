import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@/utils/supabase/server';

// Initialize Stripe only if secret key is available
const stripe = process.env.STRIPE_SECRET_KEY
    ? new Stripe(process.env.STRIPE_SECRET_KEY, {
        apiVersion: '2025-11-17.clover',
    })
    : null;

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

export async function POST(request: Request) {
    try {
        // Check if Stripe is configured
        if (!stripe || !webhookSecret) {
            return NextResponse.json({
                error: 'Webhook not configured'
            }, { status: 503 });
        }

        const body = await request.text();
        const signature = request.headers.get('stripe-signature');

        if (!signature) {
            return NextResponse.json({ error: 'No signature' }, { status: 400 });
        }

        let event: Stripe.Event;

        try {
            event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
        } catch (err) {
            console.error('Webhook signature verification failed:', err);
            return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
        }

        // Handle the checkout.session.completed event
        if (event.type === 'checkout.session.completed') {
            const session = event.data.object as Stripe.Checkout.Session;

            const userId = session.metadata?.userId;
            const packId = session.metadata?.packId;
            const credits = parseInt(session.metadata?.credits || '0');

            if (!userId || !credits) {
                console.error('Missing metadata in session:', session.id);
                return NextResponse.json({ error: 'Missing metadata' }, { status: 400 });
            }

            // Update user credits in Supabase
            const supabase = await createClient();

            // First, check if user exists in credits table
            const { data: existingUser } = await supabase
                .from('user_credits')
                .select('credits')
                .eq('user_id', userId)
                .single();

            if (existingUser) {
                // Update existing credits
                const { error: updateError } = await supabase
                    .from('user_credits')
                    .update({
                        credits: existingUser.credits + credits,
                        updated_at: new Date().toISOString()
                    })
                    .eq('user_id', userId);

                if (updateError) {
                    console.error('Error updating credits:', updateError);
                    return NextResponse.json({ error: 'Failed to update credits' }, { status: 500 });
                }
            } else {
                // Create new user credits record
                const { error: insertError } = await supabase
                    .from('user_credits')
                    .insert({
                        user_id: userId,
                        credits: credits,
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString()
                    });

                if (insertError) {
                    console.error('Error inserting credits:', insertError);
                    return NextResponse.json({ error: 'Failed to create credits' }, { status: 500 });
                }
            }

            // Log the transaction
            await supabase.from('transactions').insert({
                user_id: userId,
                pack_id: packId,
                amount: session.amount_total ? session.amount_total / 100 : 0,
                credits: credits,
                stripe_session_id: session.id,
                status: 'completed',
                created_at: new Date().toISOString()
            });

            console.log(`✅ Payment successful! User ${userId} received ${credits} credits`);
        }

        return NextResponse.json({ received: true });
    } catch (error) {
        console.error('Webhook error:', error);
        return NextResponse.json({
            error: 'Webhook handler failed',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}
