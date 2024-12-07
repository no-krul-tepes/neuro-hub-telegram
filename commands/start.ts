import { Context } from 'grammy';
import axios from 'axios';
import { config } from '../config/config';

export const startCommand = async (ctx: Context) => {
    const userId = ctx.from?.id;
    const userName = ctx.from?.first_name || 'Unknown User';

    if (!userId) {
        return await ctx.reply("Не удалось получить ваш ID. Попробуйте снова.");
    }
    
    let userAvatar: string | null = null;

    try {
        if (ctx.from?.id) {
            const photos = await ctx.api.getUserProfilePhotos(userId);
            // Если есть фотографии профиля
            if (photos.total_count > 0) {
                const fileId = photos.photos[0][0].file_id;
                const file = await ctx.api.getFile(fileId);
                userAvatar = `https://api.telegram.org/file/bot${process.env.BOT_TOKEN}/${file.file_path}`;
            }
        }
    } catch (error) {
        console.error("Error fetching user profile photo:", error);
    }

    const referralCode = ctx.message?.text?.split(' ')[1]; // Получаем реферальный код из команды, если он есть

    try {
        // Проверяем, существует ли уже пользователь в базе
        const userResponse = await axios.post(`https://${config.url}/api/user`, {
            userId,
            userName,
            userAvatar,
            referralCode,
        });

        if (userResponse.data.error) {
            return await ctx.reply(userResponse.data.error);
        }

        // Отправляем приветственное сообщение и информацию о команде
        await ctx.reply(
            `Привет, ${userName}! Добро пожаловать в наш сервис! ` +
            `Используйте команду /help, чтобы узнать доступные команды.`
        );
    } catch (error) {
        console.error('Error creating user:', error);
        await ctx.reply("Произошла ошибка при создании вашего профиля. Попробуйте позже.");
    }
};
