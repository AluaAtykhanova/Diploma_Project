// import { query } from "../dbPool.js";
const pool = require("../dbPool.js");
 //создать queries файлик и добавить логгирование
const getInfoByUserId = async (userId) => {
    try {
        // Выполнение запроса
        const query = await pool.query(`SELECT is_banned FROM user_warnings where user_id = ${userId}`);

        return query.rows[0].is_banned;
    } catch (error) {
        console.error("Error fetching warnings:", error);
        throw error;
    }
};

const addUser = async (ctx,userId) => {
    try {

        const check = await pool.query(`SELECT * FROM user_warnings where user_id = ${userId}`);

        if (check.rows.length > 0) {
			return await ctx.reply("Данный пользователь уже существует");
		}

        const query = await pool.query(`INSERT INTO user_warnings (user_id) values (${userId})`);

        return query.rows;
    } catch (error) {
        console.error("Error fetching warnings:", error);
        throw error;
    }
};

const addWarningsByUserId = async (messageId,warning,text,userId) => {
    try {
        const query = await pool.query(`
            UPDATE user_warnings 
            SET warning = warning || format(
                '[{"id": %s, "message_id": "${messageId}","warning": "${warning}", "message": "${text}"}]', 
                jsonb_array_length(warning) ---Это формула "id": %s она получит длинну массива как значение (jsonb_array_length(warning))
            )::JSONB,
            is_banned = jsonb_array_length(warning) > 3 ---Это значит что если длинна больше 4х элементов(отсчёт начинался с 0) то пользователь блокируется
            WHERE user_id = ${userId}
            RETURNING jsonb_array_length(warning) AS count, is_banned;`);

        return { 
            count: query.rows[0].count, 
            is_banned: query.rows[0].is_banned 
        };
    } catch (error) {
        console.error("Error fetching warnings:", error);
        throw error;
    }
};

module.exports = { getInfoByUserId, addUser, addWarningsByUserId };