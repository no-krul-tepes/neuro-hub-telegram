import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const generateReferralCode = async (userId: number) => {
    // Генерация уникального кода реферала для пользователя
    const referralCode = `REF${userId}-${Date.now()}`;
    await prisma.user.update({
        where: { userId },
        data: { referralCode },
    });
    return referralCode;
};
