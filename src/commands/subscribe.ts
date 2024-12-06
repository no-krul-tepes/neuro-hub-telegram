import { Context } from "grammy";
import { handleSubscription } from '../services/subscriptionService'

export const subscribeCommand = async (ctx: Context) => {
    const args = ctx.message?.text?.split(" ");
    const subscriptionType = args ? parseInt(args[1]) : null;

    if (subscriptionType) {
        const result = await handleSubscription(ctx.from?.id || 0, subscriptionType);
        await ctx.reply(result);
    } else {
        await ctx.reply("Выберите тип подписки: /subscribe 1 (1 месяц), /subscribe 2 (3 месяца), /subscribe 3 (6 месяцев), /subscribe 4 (12 месяцев).");
    }
};
