import { Context } from 'grammy';
import axios from 'axios';
import { config } from '../config/config';
import { LazySessionFlavor } from 'grammy';
import { SessionData } from '../types/session-delegate'

type MyContext = Context & LazySessionFlavor<SessionData>;

export const startCommand = async (ctx: MyContext) => {
    const session = await ctx.session;

    const userId = ctx.from?.id;
    const userName = ctx.from?.first_name || 'Unknown User';

    if (!userId) {
        return await ctx.reply("Не удалось получить ваш ID. Попробуйте снова.");
    }

    const referralCode = ctx.message?.text?.split(' ')[1];

    if (session.userId === userId) {
        // Если пользователь уже в сессии, отправляем приветственное сообщение
        await ctx.reply(
            `Привет, ${userName}! Добро пожаловать обратно в наш сервис! ` +
            `Используйте команду /help, чтобы узнать доступные команды.`
        );
        return;
    }

    // Отправляем приветственное сообщение сразу
    await ctx.reply(
        `Привет, ${userName}! Добро пожаловать в наш сервис! ` +
        `Используйте команду /help, чтобы узнать доступные команды.`
    );

    // Параллельные асинхронные задачи для получения данных
    const getUserAvatar = async () => {
        if (ctx.from?.id) {
            try {
                const photos = await ctx.api.getUserProfilePhotos(userId);
                if (photos.total_count > 0) {
                    const fileId = photos.photos[0][0].file_id;
                    const file = await ctx.api.getFile(fileId);
                    return `https://api.telegram.org/file/bot${process.env.BOT_TOKEN}/${file.file_path}`;
                }
            } catch (error) {
                console.error("Error fetching user profile photo:", error);
            }
        }
        return null;  // Возвращаем null, если фото не найдено
    };

    const createUserOnServer = async (userAvatar: string | null) => {
        try {
            const userResponse = await axios.post(`https://${config.url}/api/user`, {
                userId,
                userName,
                userAvatar,
                referralCode,
            });

            if (userResponse.data.error) {
                return await ctx.reply(userResponse.data.error);
            }
        } catch (error) {
            console.error('Error creating user:', error);
            await ctx.reply("Произошла ошибка при создании вашего профиля. Попробуйте позже.");
        }
    };

    // Получаем аватар и создаем пользователя на сервере
    const userAvatar = await getUserAvatar();
    await createUserOnServer(userAvatar);

    // Сохраняем данные в сессии после отправки сообщения
    session.userId = userId;
    session.userName = userName;
    session.userAvatar = userAvatar || undefined;
    session.referralCode = referralCode || undefined;
};
