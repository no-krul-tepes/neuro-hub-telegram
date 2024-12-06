import { Bot, webhookCallback } from "grammy";

const token = process.env.BOT_TOKEN;
const secretToken = process.env.BOT_SECRET_TOKEN;

if (!token || !secretToken) {
    console.error("BOT_TOKEN or BOT_SECRET_TOKEN is unset");
    throw new Error("BOT_TOKEN or BOT_SECRET_TOKEN is unset");
}

const bot = new Bot(token);

bot.command("start", (ctx) => ctx.reply("Привет! Я Telegram-бот!"));

export const POST = webhookCallback(bot, "std/http", {
    secretToken,
});

export const config = {
    runtime: "edge",
};