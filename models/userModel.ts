import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getUser = async (userId: number) => {
    return prisma.user.findUnique({
        where: { userId },
    })
};
