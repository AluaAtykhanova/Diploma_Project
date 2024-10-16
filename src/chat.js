import { chatWithGPT } from "./openai.js";
import { MAX_MESSAGES } from "./config.js";

export const ChatCompaion = async (ctx, messageText) => {
	try {
	if (ctx.session.messages.length > MAX_MESSAGES + 1) {
		ctx.session.messages = [
		ctx.session.messages[0],
		ctx.session.messages[1],
		...ctx.session.messages.slice(-MAX_MESSAGES),
		];
	}
	ctx.session.messages.push({ role: "user", content: messageText });

	console.log(
		"___________________________________________________________________________________________________________________"
	);
	console.log(ctx.session.messages);
	console.log(
		"___________________________________________________________________________________________________________________"
	);

	const responseContent = await chatWithGPT(ctx.session.messages);
	console.log(responseContent);

	ctx.session.messages.push({ role: "assistant", content: responseContent });
	
	await ctx.reply(responseContent);
	} catch (e) {
	console.error("Ошибка при обработке текстового сообщения", e.message);
	// ctx.session.messages.push({
	//	 role: openai.roles.ASSISTANT,
	//	 content: "Упс! Возникла ошибка, не мог бы ты повторить запрос?",
	// });
	}
};
