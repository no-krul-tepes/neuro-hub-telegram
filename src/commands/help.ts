import { Context } from "grammy";

export const helpCommand = async (ctx: Context) => {
    const helpMessage = `
    Доступные команды:
    /start — начать работу с ботом
    /subscribe — выбрать подписку
    /refer — получить реферальную ссылку
    /miniapp — перейти в Web Mini App
    /help — получить список команд
    `;
    await ctx.reply(helpMessage);
};
