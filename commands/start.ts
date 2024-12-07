import { Context } from 'grammy';
import axios from 'axios';
import { config } from '../config/config';
import { LazySessionFlavor } from 'grammy';

// Интерфейс для данных сессии
interface SessionData {
    userId: number;
    userName: string;
    userAvatar?: string;
    referralCode?: string;
}

type MyContext = Context & LazySessionFlavor<SessionData>;

export const startCommand = async (ctx: MyContext) => {
    const session = await ctx.session; // Ожидаем загрузку сессии

    const userId = ctx.from?.id;
    const userName = ctx.from?.first_name || 'Unknown User';

    if (!userId) {
        return await ctx.reply("Не удалось получить ваш ID. Попробуйте снова.");
    }

    const referralCode = ctx.message?.text?.split(' ')[1]; // Получаем реферальный код из команды, если он есть

    // Параллельные асинхронные задачи
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

    const createUserOnServer = async () => {
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

    // Параллельно выполняем запросы
    const userAvatarPromise = getUserAvatar();
    const createUserPromise = createUserOnServer();

    // Ждем завершения запросов
    const userAvatar = await userAvatarPromise;
    await createUserPromise;

    // Сохраняем данные в сессии
    session.userId = userId;
    session.userName = userName;
    session.userAvatar = userAvatar || undefined;
    session.referralCode = referralCode || undefined;

    // Отправляем приветственное сообщение
    await ctx.reply(
        `Привет, ${userName}! Добро пожаловать в наш сервис! ` +
        `Используйте команду /help, чтобы узнать доступные команды.`
    );
};
