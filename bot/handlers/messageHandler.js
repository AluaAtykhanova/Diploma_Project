const { generateChatResponse }  = require ('../utils/aiClient.js');
const { MAX_MESSAGES }  = require ('../config.js');
const { logInfo, logError }  = require ('../utils/logger.js');
const { sendMessage } = require('../middlewares/rateLimiter.js');

const handleMessage = async (ctx, messageText) => {
    try {
        ctx.session ??= { messages: [] };

        if (ctx.session.messages.length > MAX_MESSAGES) {
            ctx.session.messages = [
                ctx.session.messages[0],
                ctx.session.messages[1],
                ...ctx.session.messages.slice(-MAX_MESSAGES),
            ];
        }

        ctx.session.messages.push({ role: "user", content: messageText });
        logInfo(`User message: ${messageText}`);

        const response = await generateChatResponse(ctx.session.messages);
        ctx.session.messages.push({ role: "assistant", content: response });

        await sendMessage(ctx, response);
        logInfo(`AI response: ${response}`);
    } catch (error) {
        logError(`Error processing message(messageHandler.js): ${error.message}`);
        await sendMessage(ctx, "Произошла ошибка. Попробуй снова.");
    }
};

module.exports = { handleMessage };