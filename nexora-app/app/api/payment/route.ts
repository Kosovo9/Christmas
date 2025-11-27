import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@/utils/supabase/server';

// Initialize Stripe only if secret key is available
const stripe = process.env.STRIPE_SECRET_KEY
    ? new Stripe(process.env.STRIPE_SECRET_KEY, {
        apiVersion: '2025-11-17.clover',
    })
    : null;

// Pack configuration with credits
const PACK_CONFIG: Record<string, { name: string; credits: number; price: number }> = {
    pack_a: { name: "Pack 'Nano Banana' (Basic)", credits: 5, price: 19 },
    pack_b: { name: "Pack 'Santa Latino' (Pro)", credits: 20, price: 49 },
    pack_c: { name: "Pack 'Quantum Nexora' (Ultra)", credits: 50, price: 99 },
    pack_d: { name: "Pack 'Infinite Wolf' (Premium)", credits: 100, price: 149 },
};

export async function POST(request: Request) {
    try {
        // Check if Stripe is configured
        if (!stripe) {
            return NextResponse.json({
                error: 'Payment system not configured'
            }, { status: 503 });
        }

        const { packId, userId, userEmail } = await request.json();

        if (!packId || !userId) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const pack = PACK_CONFIG[packId];
        if (!pack) {
            return NextResponse.json({ error: 'Invalid pack ID' }, { status: 400 });
        }

        // Create Stripe Checkout Session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: pack.name,
                            description: `${pack.credits} AI Photo Credits`,
                        },
                        unit_amount: pack.price * 100, // Convert to cents
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${process.env.NEXT_PUBLIC_APP_URL}/christmas?success=true&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/christmas?canceled=true`,
            customer_email: userEmail,
            metadata: {
                userId,
                packId,
                credits: pack.credits.toString(),
            },
        });

        return NextResponse.json({
            sessionId: session.id,
            url: session.url,
            success: true
        });
    } catch (error) {
        console.error('Payment error:', error);
        return NextResponse.json({
            error: 'Payment initialization failed',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}
