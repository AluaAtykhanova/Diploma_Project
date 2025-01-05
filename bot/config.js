//bot/config.js
import {prompts} from "./prompts/prompts.js"
export const INITIAL_SESSION = {
    messages: [
        { role: "system", content: prompts.instruction },
        { role: "system", content: prompts.niceResolutions },
    ],
};

export const MAX_MESSAGES = 6; // Максимальное количество сохраняемых сообщений 