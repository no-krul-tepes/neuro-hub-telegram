import { Context } from "grammy";
import { generateReferralCode } from '../services/referralService'
import { config } from '../config/config'

export const referCommand = async (ctx: Context) => {
    const referralCode = await generateReferralCode(ctx.from?.id || 0);
    const referralLink = `https://t.me/${config.username}?start=${referralCode}`;
    await ctx.reply(`Ваша реферальная ссылка: ${referralLink}`);
};
