import OpenAI from 'openai';
import dotenv from "dotenv";
dotenv.config();

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});

export const chatWithGPT = async (messages) => {
	try {
		const chatCompletion = await openai.chat.completions.create({
			model: "gpt-3.5-turbo",
			messages: messages,
		});
		return chatCompletion.choices[0].message.content;
	} catch (error) {
		console.error('Error while chatting with GPT:', error.message);
		throw error;
	}
};

export { openai }; // Экспортируйте openai, если нужно использовать в других файлах
