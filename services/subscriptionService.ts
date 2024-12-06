import prisma from '../prisma/prisma';

export const handleSubscription = async (userId: number, subscriptionType: number) => {
    let subscriptionTypeString: "ONE_MONTH" | "THREE_MONTHS" | "SIX_MONTHS" | "TWELVE_MONTHS";

    switch (subscriptionType) {
        case 1:
            subscriptionTypeString = "ONE_MONTH";
            break;
        case 2:
            subscriptionTypeString = "THREE_MONTHS";
            break;
        case 3:
            subscriptionTypeString = "SIX_MONTHS";
            break;
        case 4:
            subscriptionTypeString = "TWELVE_MONTHS";
            break;
        default:
            throw new Error("Invalid subscription type");
    }

    const subscription = await prisma.subscription.create({
        data: {
            userId,
            subscriptionType: subscriptionTypeString,
            subscriptionStartDate: new Date(),
            subscriptionEndDate: new Date(),
            subscriptionStatus: "ACTIVE",
            paymentStatus: "COMPLETED",
        },
    });

    return `Вы успешно подписались на план ${subscriptionTypeString}!`;
};
