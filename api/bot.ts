import { Bot, Context, lazySession, LazySessionFlavor, webhookCallback } from 'grammy'
import { startCommand } from "../commands/start";
import { subscribeCommand } from "../commands/subscribe";
import { referCommand } from "../commands/refer";
import { MiniAppCommand } from "../commands/miniapp";
import { helpCommand } from "../commands/help";
import { PrismaAdapter } from '../prisma/session'
import prisma from '../prisma/prisma'

// Получаем токен из окружения
const token = process.env.BOT_TOKEN;
const secretToken = process.env.BOT_SECRET_TOKEN;

if (!token || !secretToken) {
    console.error("BOT_TOKEN or BOT_SECRET_TOKEN is unset");
    throw new Error("BOT_TOKEN or BOT_SECRET_TOKEN is unset");
}

// Интерфейс для данных сессии
interface SessionData {
    userId: number;
    userName: string;
    userAvatar?: string;
    referralCode?: string;
}

// Определяем тип контекста
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
// Подключаем команды
bot.command("start", startCommand);
bot.command("subscribe", subscribeCommand);
bot.command("refer", referCommand);
bot.command("MiniApp", MiniAppCommand);
bot.command("help", helpCommand);

// Экспортируем webhook-обработчик
export const POST = webhookCallback(bot, "std/http", {
    onTimeout: "throw",
    secretToken,
});