import { Context } from 'grammy';
import axios from 'axios';
import { config } from '../config/config';

// Интерфейс для рефералов, если у тебя нет такого интерфейса в коде
interface Referral {
    userId: number;
    createdAt: string; // Дата создания в виде строки
}

export const referCommand = async (ctx: Context) => {
    const userId = ctx.from?.id || 0;

    if (!userId) {
        return await ctx.reply("Не удалось получить ваш ID. Попробуйте снова.");
    }

    try {
        // Получаем реферальный код пользователя через API
        const { data: userData } = await axios.get(`https://${config.url}/api/user`, { params: { userId } });
        const referralCode = userData?.referralCode;

        if (!referralCode) {
            return await ctx.reply("Не удалось получить ваш реферальный код. Попробуйте позже.");
        }

        // Получаем список рефералов через API
        const { data: referralData } = await axios.post(`https://${config.url}/api/referral`, { userId });
        const referralList: Referral[] = referralData?.referralList || [];

        const referralListText = referralList.length
            ? referralList.map((referral: Referral) => `• Пользователь ID: ${referral.userId}, Дата регистрации: ${referral.createdAt}`).join('\n')
            : "Нет рефералов.";

        // Отправляем пользователю информацию
        await ctx.reply(
            `Ваш реферальный код: ${referralCode}\n` +
            `Поделитесь им с друзьями, чтобы они могли присоединиться к нашему сервису!\n` +
            `Ваша реферальная ссылка: https://${config.url}/?ref=${referralCode})\n\n` +
            `Ваши рефералы:\n${referralListText}`
        );
    } catch (error) {
        console.error('Error fetching referral information:', error);
        await ctx.reply("Произошла ошибка при получении вашей реферальной информации. Попробуйте позже.");
    }
};
