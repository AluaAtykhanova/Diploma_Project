// bot/middlewares/sendMessage.js

const { logQueue } = require('../utils/logger');

const SEND_LIMIT_GLOBAL = 30;
let globalSendCount = 0;
const sendQueue = [];

const sendMessage = async (ctx, text, messageId = null) => {
    if (globalSendCount >= SEND_LIMIT_GLOBAL) {
        sendQueue.push({ ctx, text, messageId });
        logQueue(`Сообщение в отправку поставлено в очередь. Длина очереди: ${sendQueue.length}`);
        return;
    }

    globalSendCount++;

    try {
        if (messageId) {
            await ctx.telegram.editMessageText(ctx.chat.id, messageId, undefined, text);
        } else {
            await ctx.reply(text);
        }
    } catch (error) {
        console.error("Ошибка при отправке сообщения:", error.message);
    }
};

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
    }, 2000);
};

// сброс лимита каждую минуту
setInterval(() => {
    globalSendCount = 0;
}, 60000);

module.exports = { sendMessage, processSendQueue };
