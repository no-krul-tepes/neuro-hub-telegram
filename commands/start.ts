import { Context } from "grammy";

export const startCommand = async (ctx: Context) => {
    await ctx.reply("Привет! Я Telegram-бот! Используй /help для получения доступных команд.");
};
