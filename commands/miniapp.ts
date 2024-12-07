import { Context } from "grammy";
import { config } from "../config/config";

export const MiniAppCommand = async (ctx: Context) => {
    const userId = ctx.from?.id;

    if (!userId) {
        return await ctx.reply("Не удалось получить ваш ID. Попробуйте снова.");
    }

    const MiniAppUrl = `https://${config.url}/MiniApp/${userId}`;

    // Отправляем пользователю ссылку на мини-приложение
    await ctx.reply(
        `Перейдите в наш Web Mini App для управления задачами, балансом и транзакциями: ${MiniAppUrl}`
    );
};
