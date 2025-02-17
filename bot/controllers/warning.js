const userQuery = require("../queries/userQuery");
const { logError } = require ('../utils/logger.js');

const getUserBanStatus = async (ctx,userId) => {
    try {
        const query = await userQuery.getUserBanStatus(userId);

        return query.rows[0].is_banned;
    } catch (error) {
        logError(`Error processing message: ${error.message}`);
        await ctx.reply("Произошла ошибка. Попробуй снова.");
    }
};

const addUser = async (ctx,userId) => {
    try {
        const check = await userQuery.getUser(userId);
        if (check.rows.length === 0) {
            const query = await userQuery.addUser(userId);

            return query.rows;
		}
    } catch (error) {
        await ctx.reply("Произошла ошибка. Попробуй снова.");
        logError(`Error processing message: ${error.message}`);
    }
};

const addWarningsByUserId = async (ctx,messageId,warning,text,userId) => {
    try {
        const query = await userQuery.addWarningsByUserId(ctx,messageId,warning,text,userId);

        return {
            count: query.rows[0].count, 
            is_banned: query.rows[0].is_banned 
        };
    } catch (error) {
        logError(`Error processing message: ${error.message}`);
        await ctx.reply("Произошла ошибка. Попробуй снова.");
    }
};

module.exports = { getUserBanStatus, addUser, addWarningsByUserId };