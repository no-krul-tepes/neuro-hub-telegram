import { Bot, webhookCallback } from "grammy";
import { startCommand } from "../commands/start";
import { subscribeCommand } from "../commands/subscribe";
import { referCommand } from "../commands/refer";
import { miniappCommand } from "../commands/miniapp";
import { helpCommand } from "../commands/help";

// Получаем переменные из окружения
const token = process.env.BOT_TOKEN;
const secretToken = process.env.BOT_SECRET_TOKEN;

if (!token || !secretToken) {
    console.error("BOT_TOKEN or BOT_SECRET_TOKEN is unset");
    throw new Error("BOT_TOKEN or BOT_SECRET_TOKEN is unset");
}

const bot = new Bot(token);

// Подключаем команды
bot.command("start", startCommand);
bot.command("subscribe", subscribeCommand);
bot.command("refer", referCommand);
bot.command("miniapp", miniappCommand);
bot.command("help", helpCommand);

// Экспортируем webhook-обработчик
export const POST = webhookCallback(bot, "std/http", {
    secretToken,
});

export const config = {
    runtime: "edge",
};
