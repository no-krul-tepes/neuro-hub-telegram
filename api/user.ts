import { NextRequest, NextResponse } from 'next/server';
import prisma from '../prisma/prisma';

export async function POST(req: NextRequest) {
    const { userId, userName, userAvatar, referralCode } = await req.json();

    if (!userId || !userName) {
        return NextResponse.json({ error: 'userId and userName are required' }, { status: 400 });
    }

    try {
        // Проверяем, существует ли пользователь с таким userId
        const existingUser = await prisma.user.findUnique({
            where: {
                userId,
            },
        });

        if (existingUser) {
            return NextResponse.json({ message: 'User already exists' }, { status: 200 });
        }

        // Проверяем, если пользователь пришел по реферальной ссылке
        let referredBy = null;
        if (referralCode) {
            const referrer = await prisma.user.findUnique({
                where: {
                    referralCode,
                },
            });

            if (referrer) {
                referredBy = referrer.userId;
            } else {
                return NextResponse.json({ error: 'Invalid referral code' }, { status: 400 });
            }
        }

        // Создаем нового пользователя
        const newUser = await prisma.user.create({
            data: {
                userId,
                name: userName,
                avatar: userAvatar,
                referredBy,
                subscriptionStatus: 'INACTIVE',
            },
        });

        return NextResponse.json({ message: 'User created successfully', newUser }, { status: 201 });
    } catch (error) {
        console.error('Error creating user:', error);
        return NextResponse.json({ error: 'Error creating user' }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    const { userId } = await req.json();

    if (!userId) {
        return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    try {
        // Получаем реферальный код пользователя
        const user = await prisma.user.findUnique({
            where: { userId },
            select: { referralCode: true },
        });

        if (!user || !user.referralCode) {
            return NextResponse.json({ error: 'Referral code not found' }, { status: 404 });
        }

        return NextResponse.json({ referralCode: user.referralCode });
    } catch (error) {
        console.error('Error fetching user referral code:', error);
        return NextResponse.json({ error: 'Error fetching referral code' }, { status: 500 });
    }
}
