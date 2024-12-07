import { NextRequest, NextResponse } from 'next/server';
import prisma from '../prisma/prisma';

export async function POST(req: NextRequest) {
    const { userId } = await req.json();

    if (!userId) {
        return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    try {
        // Проверяем, существует ли пользователь в базе данных
        const user = await prisma.user.findUnique({
            where: {
                userId,
            },
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Получаем список рефералов для данного пользователя
        const referrals = await prisma.referral.findMany({
            where: { referrerId: userId, isDeleted: false },
            include: {
                referee: {
                    select: {
                        userId: true,
                        createdAt: true,
                    },
                },
            },
        });


        // Формируем список рефералов
        const referralList = referrals.length
            ? referrals.map((referral) => ({
                userId: referral.referee.userId,
                createdAt: referral.referee.createdAt,
            }))
            : [];

        return NextResponse.json({ referralList });
    } catch (error) {
        console.error('Error fetching referrals:', error);
        return NextResponse.json({ error: 'Error fetching referrals' }, { status: 500 });
    }
}
