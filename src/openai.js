import dotenv from 'dotenv';
import OpenAI from 'openai';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Этот ключ можно пропустить, если он уже установлен в окружении
});

// Функция для общения с ChatGPT
export async function chatWithGPT(messages) {
  try {
    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: messages,
    });
    return chatCompletion.choices[0].message.content; // Исправлено на .content
  } catch (error) {
    console.error('Error while chatting with GPT:', error.message);
    throw error; // Важно бросать ошибку, чтобы обработать её выше
  }
}

export { openai }; // Экспортируйте openai, если нужно использовать в других файлах
