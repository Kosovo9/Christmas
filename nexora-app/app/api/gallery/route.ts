import { NextResponse } from 'next/server';

export async function GET() {
    const prompts = [
        { id: 1, text: "Christmas in New York Times Square, snowy evening", category: "City" },
        { id: 2, text: "Cozy cabin in the Alps with fireplace", category: "Nature" },
        { id: 3, text: "Santa's Workshop with elves", category: "Fantasy" },
        { id: 4, text: "Tropical Christmas on a beach in Rio", category: "Travel" }
    ];

    return NextResponse.json({ prompts });
}
