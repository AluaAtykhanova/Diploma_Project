//bot/handlers/messageHandler.js
import { identifyNegativeRequest } from '../utils/aiClient.js';
import { MAX_MESSAGES } from '../config.js';
import { logInfo, logError } from '../utils/logger.js';
import { NEGATIVE_ANALYSIS } from '../config.js';

export const detectThreatInRequest = async (ctx, messageText) => {
    try {
        let last = NEGATIVE_ANALYSIS;

        if (ctx.session.messages.length > MAX_MESSAGES) {
            last.messages = [
                last.messages[0],
                ...last.messages.slice(-MAX_MESSAGES),
            ];
        }

        last.messages.push({ role: "user", content: messageText });
        logInfo(`User message: ${messageText}`);

        const response = await identifyNegativeRequest(last.messages);

        // Отправляем ответ пользователю
        // await ctx.reply( "detectThreatInRequest "+ response);
        logInfo(`detectThreatInRequest response: ${response}`);
    } catch (error) {
        logError(`Error processing message: ${error.message}`);
        await ctx.reply("Произошла ошибка. Попробуй снова.");
    }
};
