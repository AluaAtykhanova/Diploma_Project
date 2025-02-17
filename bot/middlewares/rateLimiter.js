//bot/middlewares/rateLimiter.js
const { logQueue } = require ('../utils/logger.js');
const { handleMessage } = require ('../handlers/messageHandler.js');

const MESSAGE_LIMIT = 30; // Лимит сообщений в минуту
const RESET_INTERVAL = 60000; // Интервал сброса лимита в миллисекундах (1 минута)

let messageQueue = []; // Очередь сообщений
let messageCount = 0; // Счётчик отправленных сообщений
let lastResetTime = Date.now(); // Время последнего сброса счётчика

// Функция сброса счётчика сообщений
const resetMessageCount = () => {
    const now = Date.now();
    if (now - lastResetTime >= RESET_INTERVAL) {
        messageCount = 0;
        lastResetTime = now;
    }
};

// Основная функция для middleware
const rateLimiter = async (ctx, next) => {
    resetMessageCount();

    if (messageCount < MESSAGE_LIMIT) {
        // Если лимит не достигнут, отправляем сообщение и увеличиваем счётчик
        messageCount++;
        await next();
    } else {
        // Если лимит достигнут, добавляем сообщение в очередь
        const userId = ctx.message.from.id;
        const messageText = ctx.message.text;
        messageQueue.push({ userId, ctx, messageText });

        // Логируем добавление сообщения в очередь
        logQueue(`Message from user ${userId} added to the queue. Queue length: ${messageQueue.length}`);
    }
};

// Функция для обработки очереди сообщений
const processQueue = async () => {
    setInterval(async () => {
        resetMessageCount();

        if (messageCount < MESSAGE_LIMIT && messageQueue.length > 0) {
            const messageData = messageQueue.shift(); // Извлекаем первое сообщение из очереди
            const { userId, ctx, messageText } = messageData;

            // Отправляем классическое сообщение "Сообщение получено. Обрабатываю..."
            await ctx.reply("Сообщение получено. Обрабатываю...");

            // Логируем отправку сообщения
            logQueue(`Message to user ${userId} sent from queue. Queue length: ${messageQueue.length}`);

            // Продолжаем обработку сообщения
            await handleMessage(ctx, messageText);
 
            // Увеличиваем счётчик отправленных сообщений
            messageCount++;
        }
    }, 1000); // Проверяем очередь каждую секунду
};

module.exports = { processQueue, rateLimiter};