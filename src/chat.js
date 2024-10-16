import dotenv from 'dotenv';
import { openai } from "./openai.js";
dotenv.config();
import { chatWithGPT } from "./openai.js"; // Импортируйте функцию chatWithGPT

export async function ChatCompaion(ctx, messageText) {
    try {  
      const MAX_MESSAGES = 6; // Максимальное количество сохраняемых сообщений

      // Проверяем, есть ли достаточно сообщений для удаления
      if (ctx.session.messages.length > MAX_MESSAGES + 1) {
          // Оставляем первое сообщение и последние четыре
          ctx.session.messages = [
              ctx.session.messages[0],
              ctx.session.messages[1],
              ...ctx.session.messages.slice(-MAX_MESSAGES)
          ];
      }
      ctx.session.messages.push({
        role: "user", // Здесь используем строку, так как это обычный текст
        content: messageText,
    });
  
      console.log(
        "___________________________________________________________________________________________________________________"
      );
      console.log(ctx.session.messages);
      console.log(
        "___________________________________________________________________________________________________________________"
      );
  
      const responseContent = await chatWithGPT(ctx.session.messages); // Вызов функции
  
      console.log(responseContent);
  
      ctx.session.messages.push({
        role: "assistant",
        content: responseContent,
    });
  
    await ctx.reply(responseContent); // Отправляем ответ пользователю
} catch (e) {
      console.log("Ошибка при обработке текстового сообщения", e.message);
      // ctx.session.messages.push({
      //   role: openai.roles.ASSISTANT,
      //   content: "Упс! Возникла ошибка, не мог бы ты повторить запрос?",
      // });
    }
  }
  