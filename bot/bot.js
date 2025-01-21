//bot/bot.js 
import { Telegraf, session } from "telegraf";
import { INITIAL_SESSION } from './config.js';
import { startNewSession } from './commands/sessionCommands.js';
import { handleMessage } from './handlers/messageHandler.js';
import { rateLimiter, processQueue } from './middlewares/rateLimiter.js';
import { detectThreatInRequest } from './middlewares/detectThreatInRequest.js';

const BOT_TOKEN = process.env.TELEGRAM_TOKEN;

export const startBot = () => {
    const bot = new Telegraf(BOT_TOKEN); 

    bot.use(session());
    bot.use(rateLimiter);

    bot.command('start', async (ctx) => await startNewSession(ctx));
    bot.command('new', async (ctx) => await startNewSession(ctx));

    bot.on('text', async (ctx) => {
        ctx.session ??= INITIAL_SESSION;
        const messageText = ctx.message.text;
        await ctx.reply("Сообщение получено. Обрабатываю...");
        await detectThreatInRequest(ctx, messageText);
        await handleMessage(ctx, messageText);
    });

    bot.launch();

    process.once("SIGINT", () => bot.stop("SIGINT"));
    process.once("SIGTERM", () => bot.stop("SIGTERM"));

    processQueue(); 
};
