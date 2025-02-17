const pool = require("../dbPool.js");

const getUserBanStatus = async (userId) => {
    const query = await pool.query(`SELECT is_banned FROM user_warnings where user_id = ${userId}`);

    return query;
};

const getUser = async (userId) => {
    const query = await pool.query(`SELECT * FROM user_warnings where user_id = ${userId}`);

    return query;
};

const addUser = async (userId) => {
    const query = await pool.query(`INSERT INTO user_warnings (user_id) values (${userId})`);

    return query;
};

const addWarningsByUserId = async (messageId,warning,text,userId) => {
    const query = await pool.query(`
        UPDATE user_warnings 
        SET warning = warning || format(
            '[{"id": %s, "message_id": "${messageId}","warning": "${warning}", "message": "${text}"}]', 
            jsonb_array_length(warning) ---Это формула "id": %s она получит длинну массива как значение (jsonb_array_length(warning))
        )::JSONB,
        is_banned = jsonb_array_length(warning) > 3 ---Это значит что если длинна больше 4х элементов(отсчёт начинался с 0) то пользователь блокируется
        WHERE user_id = ${userId}
        RETURNING jsonb_array_length(warning) AS count, is_banned;`);

    return query;
};

module.exports = { getUserBanStatus, getUser, addUser, addWarningsByUserId};