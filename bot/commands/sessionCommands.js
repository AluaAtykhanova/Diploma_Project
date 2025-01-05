import { INITIAL_SESSION } from '../config.js';

export const startNewSession = async (ctx) => {
    ctx.session = INITIAL_SESSION;
    await ctx.reply("Привет! Я - Аяу, твоя менторка в дебатах. Жду твой запрос!");
};
