import { Context } from "grammy";
import axios from 'axios';
import { config } from '../config/config'

export const referCommand = async (ctx: Context) => {
    const userId = ctx.from?.id || 0;

    try {
        const response = await axios.post(`${config.url}/api/referral`, { userId });
        const referralCode = response.data.referralCode;
        const referralLink = `https://t.me/${config.username}?start=${referralCode}`;
        await ctx.reply(`Ваша реферальная ссылка: ${referralLink}`);
    } catch (error) {
        await ctx.reply("Произошла ошибка при генерации реферальной ссылки.");
    }
};
