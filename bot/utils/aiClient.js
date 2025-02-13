//bot/utils/aiClient.js
const OpenAI = require ('openai');
const dotenv = require ('dotenv');

dotenv.config();

const openai1 = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY_1,
});

const openai2 = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY_2,
});

const identifyNegativeRequest = async (messages) => {
    try {
        const chatCompletion = await openai1.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages,
        });

        return chatCompletion.choices[0].message.content;
    } catch (error) {
        console.error('Error in OpenAI interaction (identifyNegativeRequest):', error.message, messages);
        throw error;
    }
};

const generateChatResponse = async (messages) => {
    try {
        const chatCompletion = await openai2.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages,
        });
        return chatCompletion.choices[0].message.content;
    } catch (error) {
        console.error('Error in OpenAI interaction (generateChatResponse):', error.message);
        throw error;
    }
};

module.exports = { generateChatResponse, identifyNegativeRequest };