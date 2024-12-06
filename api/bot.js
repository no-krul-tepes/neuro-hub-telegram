"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = exports.POST = void 0;
const grammy_1 = require("grammy");
const start_1 = require("../src/commands/start");
const subscribe_1 = require("../src/commands/subscribe");
const refer_1 = require("../src/commands/refer");
const miniapp_1 = require("../src/commands/miniapp");
const help_1 = require("../src/commands/help");
const token = process.env.BOT_TOKEN;
const secretToken = process.env.BOT_SECRET_TOKEN;
if (!token || !secretToken) {
    console.error("BOT_TOKEN or BOT_SECRET_TOKEN is unset");
    throw new Error("BOT_TOKEN or BOT_SECRET_TOKEN is unset");
}
const bot = new grammy_1.Bot(token);
// Подключаем команды
bot.command("start", start_1.startCommand);
bot.command("subscribe", subscribe_1.subscribeCommand);
bot.command("refer", refer_1.referCommand);
bot.command("miniapp", miniapp_1.miniappCommand);
bot.command("help", help_1.helpCommand);
// Экспортируем webhook-обработчик
exports.POST = (0, grammy_1.webhookCallback)(bot, "std/http", {
    secretToken,
});
exports.config = {
    runtime: "edge",
};
