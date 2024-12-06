import { Context } from "grammy";

export const miniappCommand = async (ctx: Context) => {
    const miniappUrl = `https://your-web-app-url.com/${ctx.from?.id}`;
    await ctx.reply(`Перейдите в наш Web Mini App для управления задачами, балансом и транзакциями: ${miniappUrl}`);
};
