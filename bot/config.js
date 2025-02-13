//bot/config.js
const {prompts} = require ('./prompts/prompts.js')
const {context} = require ('./prompts/instructions.js')

const INITIAL_SESSION = {
    messages: [
        { role: "system", content: prompts.instruction },
        { role: "system", content: prompts.niceResolutions },
    ],
};
const NEGATIVE_ANALYSIS = {
    messages: [
        { role: "system", content: context.instruction },
        // { role: "system", content: context.findNegative },
    ],
};
const MAX_MESSAGES = 6; // Максимальное количество сохраняемых сообщений 

module.exports = { INITIAL_SESSION, NEGATIVE_ANALYSIS, MAX_MESSAGES};