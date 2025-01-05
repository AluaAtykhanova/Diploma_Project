import OpenAI from 'openai';
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export const generateChatResponse = async (messages) => {
    try {
        const chatCompletion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages,
        });
        return chatCompletion.choices[0].message.content;
    } catch (error) {
        console.error('Error in OpenAI interaction:', error.message);
        throw error;
    }
};
