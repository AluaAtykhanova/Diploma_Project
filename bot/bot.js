//bot/bot.js 
import { Telegraf, session } from "telegraf";
import { INITIAL_SESSION } from './config.js';
import { startNewSession } from './commands/sessionCommands.js';
import { handleMessage } from './handlers/messageHandler.js';
const BOT_TOKEN = process.env.TELEGRAM_TOKEN;

export const startBot = () => {
    const bot = new Telegraf(BOT_TOKEN); 

    bot.use(session());

    bot.command('start', async (ctx) => await startNewSession(ctx));
    bot.command('new', async (ctx) => await startNewSession(ctx));

    bot.on('text', async (ctx) => {
        ctx.session ??= INITIAL_SESSION;
        const messageText = ctx.message.text;
        await ctx.reply("Сообщение получено. Обрабатываю...");
        await handleMessage(ctx, messageText);
    });

    bot.launch();

    process.once("SIGINT", () => bot.stop("SIGINT"));
    process.once("SIGTERM", () => bot.stop("SIGTERM"));
};
