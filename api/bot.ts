import { Bot, webhookCallback } from "grammy";

// Получаем токен бота и секретный токен
const token = process.env.BOT_TOKEN;
const secretToken = process.env.BOT_SECRET_TOKEN;  // Ваш секретный токен

if (!token || !secretToken) {
    console.error("BOT_TOKEN or BOT_SECRET_TOKEN is unset");
    throw new Error("BOT_TOKEN or BOT_SECRET_TOKEN is unset");
}

const bot = new Bot(token);

// Example of a basic command
bot.command("start", (ctx) => ctx.reply("Привет! Я Telegram-бот!"));

// Обработчик POST запроса для webhook
export const POST = webhookCallback(bot, "std/http", {
    secretToken,
});

// Настройка для Edge runtime
export const config = {
    runtime: "edge",
};
