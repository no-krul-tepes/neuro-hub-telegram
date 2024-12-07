import { Context, LazySessionFlavor } from "grammy";
import { config } from "../config/config";

interface SessionData {
    userId: number;
    userName: string;
    userAvatar?: string;
    referralCode?: string;
}

type MyContext = Context & LazySessionFlavor<SessionData>;

export const MiniAppCommand = async (ctx: MyContext) => {
    const session = await ctx.session;

    const userId = session.userId;

    if (!userId) {
        return await ctx.reply("Не удалось получить ваш ID. Попробуйте снова.");
    }

    const MiniAppUrl = `https://${config.url}/MiniApp/${userId}`;

    await ctx.reply(
        `Перейдите в наш Web Mini App для управления задачами, балансом и транзакциями: ${MiniAppUrl}`
    );
};
