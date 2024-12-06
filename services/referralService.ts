import prisma from '../prisma/prisma';

export const generateReferralCode = async (userId: number) => {
    const referralCode = `REF${userId}-${Date.now()}`;
    await prisma.user.update({
        where: { userId },
        data: { referralCode },
    });
    return referralCode;
};
