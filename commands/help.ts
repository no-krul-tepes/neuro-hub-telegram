import { Context } from "grammy";

export const helpCommand = async (ctx: Context) => {
    const helpMessage = `
    Тут будет помощь
    `;
    await ctx.reply(helpMessage);
};
