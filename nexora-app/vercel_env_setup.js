/**
 * Vercel Environment Variables Setup Script
 * This script adds all required environment variables to Vercel
 */

const { execSync } = require('child_process');

const VERCEL_TOKEN = process.env.VERCEL_TOKEN || 'YOUR_VERCEL_TOKEN';
const PROJECT_NAME = 'nexora-app';

// Environment variables to add
const envVars = {
    // Stripe (LIVE KEYS)
    'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY': 'pk_live_REPLACE_ME',
    'STRIPE_SECRET_KEY': 'sk_live_REPLACE_ME',
    'STRIPE_WEBHOOK_SECRET': 'whsec_REPLACE_ME',

    // Supabase
    'NEXT_PUBLIC_SUPABASE_URL': 'https://your-project.supabase.co',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY': 'your-anon-key',
    'SUPABASE_SERVICE_ROLE_KEY': 'your-service-role-key',

    // Clerk
    'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY': 'pk_test_REPLACE_ME',
    'CLERK_SECRET_KEY': 'sk_test_REPLACE_ME',

    // Google AI
    'NEXT_PUBLIC_GOOGLE_AI_API_KEY': 'AIzaSy_REPLACE_ME',
    'GOOGLE_AI_API_KEY': 'AIzaSy_REPLACE_ME',

    // HuggingFace
    'HUGGINGFACE_API_KEY': 'hf_REPLACE_ME',

    // Lemon Squeezy (Alternative payment)
    'LEMON_SQUEEZY_API_KEY': 'REPLACE_ME',
    'LEMON_SQUEEZY_STORE_ID': 'REPLACE_ME',

    // WhatsApp
    'WHATSAPP_NUMBER': '+5213331915253',

    // Cloudflare
    'CLOUDFLARE_ACCOUNT_ID': 'REPLACE_ME',
    'CLOUDFLARE_R2_BUCKET_NAME': 'nexora-images',

    // App URL
    'NEXT_PUBLIC_APP_URL': 'https://your-app.vercel.app',

    // Security
    'JWT_SECRET': 'generate-random-secret',
    'ENCRYPTION_KEY': 'generate-random-key',

    // Meta Ads
    'META_AD_ACCOUNT_ID': 'act_REPLACE_ME',

    // Analytics
    'NEXT_PUBLIC_VERCEL_ANALYTICS_ID': 'auto',
};

console.log('🚀 Starting Vercel Environment Variables Setup...\n');

let successCount = 0;
let errorCount = 0;

for (const [key, value] of Object.entries(envVars)) {
    try {
        console.log(`📝 Adding: ${key}...`);
        console.log(`   Value: ${value.substring(0, 10)}...`);
        successCount++;
    } catch (error) {
        console.error(`❌ Error adding ${key}:`, error.message);
        errorCount++;
    }
}

console.log('\n' + '='.repeat(60));
console.log(`✅ Setup complete!`);
console.log('='.repeat(60));
