// commands/subscribe.ts
import { Context } from 'grammy';
import axios from 'axios';
import { config } from '../config/config';

export const subscribeCommand = async (ctx: Context) => {
    const args = ctx.message?.text?.split(" ");
    const subscriptionType = args ? parseInt(args[1]) : null;

    const userId = ctx.from?.id || 0;

    if (!userId) {
        return await ctx.reply("Не удалось получить ваш ID. Попробуйте снова.");
    }

    if (!subscriptionType) {
        return await ctx.reply(
            "Выберите тип подписки: \n" +
            "/subscribe 1 — 1 месяц \n" +
            "/subscribe 2 — 3 месяца \n" +
            "/subscribe 3 — 6 месяцев \n" +
            "/subscribe 4 — 12 месяцев"
        );
    }

    try {
        // Отправляем запрос на API для создания подписки
        const response = await axios.post(`https://${config.url}/api/subscription`, {
            userId,
            subscriptionType
        });

        const { subscription } = response.data;

        if (!subscription) {
            return await ctx.reply("Произошла ошибка при оформлении подписки.");
        }

        // Отправляем успешное сообщение пользователю
        await ctx.reply(
            `Ваша подписка оформлена!\n` +
            `Тип: ${subscription.subscriptionType}\n` +
            `Дата начала: ${new Date(subscription.subscriptionStartDate).toLocaleDateString()}\n` +
            `Дата окончания: ${new Date(subscription.subscriptionEndDate).toLocaleDateString()}\n` +
            `Статус: Платеж ожидает подтверждения`
        );
    } catch (error) {
        console.error('Error processing subscription:', error);
        await ctx.reply("Произошла ошибка при оформлении подписки. Попробуйте позже.");
    }
};
