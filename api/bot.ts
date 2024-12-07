import { Bot, Context, session, SessionFlavor, webhookCallback } from 'grammy'
import { PrismaAdapter } from "@grammyjs/storage-prisma";
import { startCommand } from "../commands/start";
import { subscribeCommand } from "../commands/subscribe";
import { referCommand } from "../commands/refer";
import { MiniAppCommand } from "../commands/miniapp";
import { helpCommand } from "../commands/help";
import prisma from '../prisma/prisma'

// Получаем токен из окружения
const token = process.env.BOT_TOKEN;
const secretToken = process.env.BOT_SECRET_TOKEN;

if (!token || !secretToken) {
    console.error("BOT_TOKEN or BOT_SECRET_TOKEN is unset");
    throw new Error("BOT_TOKEN or BOT_SECRET_TOKEN is unset");
}

// Модель данных сессии для нашего контекста
interface SessionData {
    userId: number | null;
    subscriptionStatus: "ACTIVE" | "INACTIVE";
}

// Создаем контекст для grammy
type MyContext = Context & SessionFlavor<SessionData>;

// Создаем бота и добавляем Prisma в качестве хранилища сессий
const bot = new Bot<MyContext>(token);

bot.use(
    session({
        initial: () => ({ userId: null, subscriptionStatus: "INACTIVE" }),
        storage: new PrismaAdapter(prisma.session),
    })
);
// Обработчик ошибок
bot.catch(async (err) => {
    console.error("Error occurred:", err);
    // Логирование ошибки или уведомление администратора
});

// Подключаем команды
bot.command("start", startCommand);
bot.command("subscribe", subscribeCommand);
bot.command("refer", referCommand);
bot.command("MiniApp", MiniAppCommand);
bot.command("help", helpCommand);

// Экспортируем webhook-обработчик
export const POST = webhookCallback(bot, "std/http", {
    onTimeout: "throw",
    secretToken
});

// Конфигурация для edge runtime
export const config = {
    runtime: "edge",
};
