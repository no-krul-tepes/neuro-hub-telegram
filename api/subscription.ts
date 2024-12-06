import { NextRequest, NextResponse } from "next/server";
import { handleSubscription } from "../services/subscriptionService";

export async function POST(req: NextRequest) {
    const { userId, subscriptionType } = await req.json(); // Получаем данные из тела запроса

    if (!userId || !subscriptionType) {
        return NextResponse.json({ error: 'userId and subscriptionType are required' }, { status: 400 });
    }

    try {
        const result = await handleSubscription(userId, subscriptionType);
        return NextResponse.json({ message: result });
    } catch (error) {
        return NextResponse.json({ error: 'Error processing subscription' }, { status: 500 });
    }
}
