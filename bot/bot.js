//bot/bot.js 
const { Telegraf, session } = require ("telegraf");
const { INITIAL_SESSION } = require ('./config.js');
const { startNewSession } = require ('./commands/sessionCommands.js');
const { rateLimiter, processQueue } = require ('./middlewares/rateLimiter.js');
const { sendMessage, processSendQueue } = require ('./middlewares/sendMessage.js');
const { detectThreatInRequest } = require ('./middlewares/detectThreatInRequest.js');
const { addUser,getUserBanStatus } = require ('./controllers/warning.js');

const BOT_TOKEN = process.env.TELEGRAM_TOKEN;

const startBot = () => {
    const bot = new Telegraf(BOT_TOKEN); 

    bot.use(session());
    bot.use(rateLimiter);

    bot.command('start', async (ctx) => await startNewSession(ctx));
    bot.command('new', async (ctx) => await startNewSession(ctx));

    bot.on('text', async (ctx) => {
        ctx.session ??= INITIAL_SESSION;
        const messageText = ctx.message.text;
        addUser(ctx, ctx.message.from.id);
        const { is_banned } = await getUserBanStatus(ctx, ctx.message.from.id);

        if (is_banned) {
            await sendMessage(ctx, "Извините, Вы в нашем стоп листе");
        } else {
            await sendMessage(ctx, "Сообщение получено. Обрабатываю...");
            await detectThreatInRequest(ctx, messageText);
        }
    });

    bot.launch();

    process.once("SIGINT", () => bot.stop("SIGINT"));
    process.once("SIGTERM", () => bot.stop("SIGTERM"));

    processQueue();
    processSendQueue();
};

module.exports = { startBot };