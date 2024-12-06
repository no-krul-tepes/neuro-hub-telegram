import { Bot, webhookCallback } from "grammy";

const token = process.env.BOT_TOKEN;
if (!token) {
    console.error("BOT_TOKEN is unset");
    throw new Error("BOT_TOKEN is unset");
}

const bot = new Bot(token);

bot.command("start", (ctx) => ctx.reply("Привет! Я Telegram-бот!"));

export default webhookCallback(bot, "std/http");
