import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";

export const runtime = 'edge';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || '');

export async function POST(request: Request) {
    try {
        const { message, history } = await request.json();

        if (!process.env.GOOGLE_GEMINI_API_KEY) {
            return NextResponse.json({ error: "AI Service Unavailable" }, { status: 503 });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const chat = model.startChat({
            history: history || [],
            generationConfig: {
                maxOutputTokens: 200,
            },
        });

        const systemContext = `
            You are 'Elf-Bot', the 24/7 AI Support Agent for Nexora Christmas App.
            Your tone is festive, helpful, and slightly magical.
            
            Key Info:
            - We generate AI Christmas photos.
            - Packs: Nano Banana ($19), Santa Latino ($49), Quantum Nexora ($99).
            - Issues with download? Tell them to check their email or "My Orders".
            - Payments are secure via Stripe.
            - If you can't help, ask them to email support@nexora.com.
            
            Keep answers short (under 50 words) and helpful.
        `;

        const result = await chat.sendMessage(`${systemContext}\n\nUser: ${message}`);
        const response = result.response.text();

        return NextResponse.json({ response });

    } catch (error) {
        console.error("Chat error:", error);
        return NextResponse.json({ error: "Failed to process message" }, { status: 500 });
    }
}
