import { Bot, webhookCallback } from "grammy";

const token = process.env.BOT_TOKEN;
if (!token) {
    console.error("BOT_TOKEN is unset");
    throw new Error("BOT_TOKEN is unset");
}

const bot = new Bot(token);

// Example of a basic command
bot.command("start", (ctx) => ctx.reply("Привет! Я Telegram-бот!"));

// The handler function to handle the webhook request
export const handler = async (req: Request) => {
    try {
        // Parsing the request body as JSON.
        // req.json() is an async method for parsing JSON in Edge functions.
        const body = await req.json();

        // Handle the webhook callback with the parsed body
        return webhookCallback(bot, "std/http")(body);
    } catch (error) {
        console.error("Error processing webhook request", error);
        return new Response("Internal Server Error", { status: 500 });
    }
};

export const config = {
    runtime: "edge",
};
