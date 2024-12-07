import { Bot, Context, lazySession, LazySessionFlavor, webhookCallback } from 'grammy'
import { startCommand } from "../commands/start";
import { helpCommand } from "../commands/help";
import { PrismaAdapter } from '../prisma/session'
import prisma from '../prisma/prisma'
import { SessionData } from '../types/session-delegate'

const token = process.env.BOT_TOKEN;
const secretToken = process.env.BOT_SECRET_TOKEN;

if (!token || !secretToken) {
    console.error("BOT_TOKEN or BOT_SECRET_TOKEN is unset");
    throw new Error("BOT_TOKEN or BOT_SECRET_TOKEN is unset");
}

type MyContext = Context & LazySessionFlavor<SessionData>;

const bot = new Bot<MyContext>(token);

// Обработчик ошибок
bot.catch(async (err) => {
    console.error("Error occurred:", err);
    // Логирование ошибки или уведомление администратора
});

// Подключаем ленивые сессии через middleware
bot.use(
    lazySession({
        initial: (): SessionData => ({
            userId: 0,
            userName: '',
        }),
        storage: new PrismaAdapter(prisma.session),
    })
);

bot.command("help", helpCommand);
bot.on('message:text', startCommand);

// Экспортируем webhook-обработчик
export const POST = webhookCallback(bot, "std/http", {
    onTimeout: "throw",
    secretToken,
});

// export const config = {
//     runtime: "edge",
// };