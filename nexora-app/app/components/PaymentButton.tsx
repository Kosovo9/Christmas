'use client';

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';

interface PaymentButtonProps {
    packId: string;
    packName: string;
    price: number;
    className?: string;
}

export default function PaymentButton({ packId, packName, price, className }: PaymentButtonProps) {
    const { user } = useUser();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handlePayment = async () => {
        if (!user) {
            setError('Please sign in to purchase');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/payment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    packId,
                    userId: user.id,
                    userEmail: user.primaryEmailAddress?.emailAddress,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Payment failed');
            }

            // Redirect to Stripe Checkout
            if (data.url) {
                window.location.href = data.url;
            } else {
                throw new Error('No checkout URL received');
            }
        } catch (err) {
            console.error('Payment error:', err);
            setError(err instanceof Error ? err.message : 'Payment failed');
            setLoading(false);
        }
    };

    return (
        <div className="relative">
            <button
                onClick={handlePayment}
                disabled={loading}
                className={className || 'w-full bg-gradient-to-r from-red-600 to-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-red-700 hover:to-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed'}
            >
                {loading ? (
                    <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Processing...
                    </span>
                ) : (
                    `Buy ${packName} - $${price}`
                )}
            </button>
            {error && (
                <p className="mt-2 text-sm text-red-500 text-center">{error}</p>
            )}
        </div>
    );
}
