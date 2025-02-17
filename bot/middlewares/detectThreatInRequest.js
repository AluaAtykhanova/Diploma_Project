//bot/handlers/messageHandler.js
const { identifyNegativeRequest } = require ('../utils/aiClient.js');
const { MAX_MESSAGES } = require ('../config.js');
const { logSecure, logError } = require ('../utils/logger.js');
const { NEGATIVE_ANALYSIS } = require ('../config.js');
const { handleMessage } = require ('../handlers/messageHandler.js');
const { addWarningsByUserId } = require ('../controllers/warning.js');

const detectThreatInRequest = async (ctx, messageText) => {
    try {
        let last = NEGATIVE_ANALYSIS;

        if (ctx.session.messages.length > MAX_MESSAGES) {
            last.messages = [
                last.messages[0],
                ...last.messages.slice(-MAX_MESSAGES),
            ];
        }

        last.messages.push({ role: "user", content: messageText });
        logSecure(`User message: ${messageText}`);

        const response = await identifyNegativeRequest(last.messages);
        logSecure(`detectThreatInRequest response: ${response}`);

        if (response.startsWith('True')) {
            const { count, is_banned } = await addWarningsByUserId(ctx,ctx.message.message_id,response,messageText,ctx.message.from.id)

            if (is_banned) {
                return await ctx.reply(`detectThreatInRequest Извините, теперь, Вы в нашем стоп листе`);
            } else {
                return await ctx.reply(`detectThreatInRequest Предупреждение №${count}/5: ` + response);
            }
        }
        await handleMessage(ctx, messageText);
    } catch (error) {
        logError(`Error processing message: ${error.message}`);
        await ctx.reply("Произошла ошибка. Попробуй снова.");
    }
};

module.exports = { detectThreatInRequest };