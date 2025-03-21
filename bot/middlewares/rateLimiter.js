// bot/middlewares/rateLimiter.js
const { logQueue } = require('../utils/logger.js');
const { handleMessage } = require('../handlers/messageHandler.js');

const MESSAGE_LIMIT_GLOBAL = 30; // Максимальное количество принимаемых сообщений в минуту
const SEND_LIMIT_GLOBAL = 30; // Максимальное количество отправляемых сообщений в минуту
const RESET_INTERVAL = 60000; // Сброс лимита (1 минута)
const CHECK_QUEUE_INTERVAL = 2000; // Интервал обработки очереди (2 секунды)

let globalMessageCount = 0; // Счетчик входящих сообщений
let globalSendCount = 0; // Счетчик отправленных сообщений
const messageQueue = []; // Очередь входящих сообщений
const sendQueue = []; // Очередь сообщений на отправку

// Сбрасываем лимиты каждую минуту
setInterval(() => {
    globalMessageCount = 0;
    globalSendCount = 0;
}, RESET_INTERVAL);

// Лимит на приём сообщений
const rateLimiter = async (ctx, next) => {
    if (globalMessageCount >= MESSAGE_LIMIT_GLOBAL) {
        const processingMessage = await ctx.reply("⏳ Очередь обработки. Пожалуйста, подождите...");
        messageQueue.push({ ctx, processingMessage });
        logQueue(`Сообщение от ${ctx.message.from.id} добавлено в очередь. Длина очереди: ${messageQueue.length}`);
        return;
    }

    globalMessageCount++;
    await next();
};

// Функция для отправки сообщений с глобальным лимитом
const sendMessage = async (ctx, text, messageId = null) => {
    if (globalSendCount >= SEND_LIMIT_GLOBAL) {
        sendQueue.push({ ctx, text, messageId });
        logQueue(`Сообщение в отправку поставлено в очередь. Длина очереди: ${sendQueue.length}`);
        return;
    }

    globalSendCount++;

    try {
        if (messageId) {
            // Если нужно обновить старое сообщение (например, "Очередь обработки" → "Ваш запрос обрабатывается...")
            await ctx.telegram.editMessageText(ctx.chat.id, messageId, undefined, text);
        } else {
            await ctx.reply(text);
        }
    } catch (error) {
        console.error("Ошибка при отправке сообщения:", error.message);
    }
};

// Обработчик очереди входящих сообщений
const processQueue = async () => {
    setInterval(async () => {
        if (messageQueue.length > 0 && globalMessageCount < MESSAGE_LIMIT_GLOBAL) {
            const { ctx, processingMessage } = messageQueue.shift();

            // Обновляем сообщение "в обработке"
            try {
                await sendMessage(ctx, "✅ Ваш запрос обрабатывается...", processingMessage.message_id);
            } catch (error) {
                console.error("Ошибка при обновлении сообщения:", error.message);
            }

            globalMessageCount++;
            await handleMessage(ctx, ctx.message.text);
        }
    }, CHECK_QUEUE_INTERVAL);
};

// Обработчик очереди на отправку сообщений
const processSendQueue = async () => {
    setInterval(async () => {
        if (sendQueue.length > 0 && globalSendCount < SEND_LIMIT_GLOBAL) {
            const { ctx, text, messageId } = sendQueue.shift();
            globalSendCount++;

            try {
                if (messageId) {
                    await ctx.telegram.editMessageText(ctx.chat.id, messageId, undefined, text);
                } else {
                    await ctx.reply(text);
                }
            } catch (error) {
                console.error("Ошибка при отправке сообщения из очереди:", error.message);
            }
        }
    }, CHECK_QUEUE_INTERVAL);
};

module.exports = { rateLimiter, processQueue, sendMessage, processSendQueue };
