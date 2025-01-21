//bot/config.js
import {prompts} from "./prompts/prompts.js"
import {context} from "./prompts/instructions.js"

export const INITIAL_SESSION = {
    messages: [
        { role: "system", content: prompts.instruction },
        { role: "system", content: prompts.niceResolutions },
    ],
};
export const NEGATIVE_ANALYSIS = {
    messages: [
        { role: "system", content: context.instruction },
        // { role: "system", content: context.findNegative },
    ],
};
export const MAX_MESSAGES = 6; // Максимальное количество сохраняемых сообщений 