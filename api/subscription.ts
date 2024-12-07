// api/subscription.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '../prisma/prisma';
import { SubscriptionType, SubscriptionStatus, PaymentStatus } from '@prisma/client';

export async function POST(req: NextRequest) {
    const { userId, subscriptionType } = await req.json();

    if (!userId || !subscriptionType) {
        return NextResponse.json({ error: 'userId and subscriptionType are required' }, { status: 400 });
    }

    // Проверка валидности типа подписки
    if (![SubscriptionType.ONE_MONTH, SubscriptionType.THREE_MONTHS, SubscriptionType.SIX_MONTHS, SubscriptionType.TWELVE_MONTHS].includes(subscriptionType)) {
        return NextResponse.json({ error: 'Invalid subscription type' }, { status: 400 });
    }

    try {
        // Проверяем существование пользователя в базе данных
        const user = await prisma.user.findUnique({
            where: { userId },
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Создаем подписку для пользователя
        const newSubscription = await prisma.subscription.create({
            data: {
                userId,
                subscriptionType,
                subscriptionStatus: SubscriptionStatus.PENDING,
                paymentStatus: PaymentStatus.PENDING,
                subscriptionStartDate: new Date(),
                subscriptionEndDate: new Date(new Date().setMonth(new Date().getMonth() + (subscriptionType === SubscriptionType.ONE_MONTH ? 1 :
                    subscriptionType === SubscriptionType.THREE_MONTHS ? 3 :
                        subscriptionType === SubscriptionType.SIX_MONTHS ? 6 : 12))),
            },
        });

        return NextResponse.json({ subscription: newSubscription });
    } catch (error) {
        console.error('Error processing subscription:', error);
        return NextResponse.json({ error: 'Error processing subscription' }, { status: 500 });
    }
}
