"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const grammy_1 = require("grammy");
const token = process.env.BOT_TOKEN;
if (!token)
    throw new Error("BOT_TOKEN is unset");
const bot = new grammy_1.Bot(token);
bot.command("start", (ctx) => ctx.reply("Привет! Я Telegram-бот!"));
exports.default = (0, grammy_1.webhookCallback)(bot, "std/http");
