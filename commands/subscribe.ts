import { Context } from "grammy";
import axios from 'axios';

export const subscribeCommand = async (ctx: Context) => {
    const args = ctx.message?.text?.split(" ");
    const subscriptionType = args ? parseInt(args[1]) : null;
    const userId = ctx.from?.id || 0;

    if (subscriptionType) {
        try {
            const response = await axios.post('https://your-vercel-deployment-url/api/subscription', {
                userId,
                subscriptionType
            });
            const result = response.data.message;
            await ctx.reply(result);
        } catch (error) {
            await ctx.reply("Произошла ошибка при оформлении подписки.");
        }
    } else {
        await ctx.reply("Выберите тип подписки: /subscribe 1 (1 месяц), /subscribe 2 (3 месяца), /subscribe 3 (6 месяцев), /subscribe 4 (12 месяцев).");
    }
};
