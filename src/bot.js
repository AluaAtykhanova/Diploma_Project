import { Telegraf, session } from "telegraf";
import { INITIAL_SESSION } from "./config.js";
import { ChatCompaion } from "./chat.js";

const telegram_token = process.env.TELEGRAM_TOKEN;

export const startBot = () => {
	const bot = new Telegraf(telegram_token);
	bot.use(session());

	bot.command("new", async (ctx) => {
		ctx.session = INITIAL_SESSION;
		await ctx.reply("Привет! Я - Аяу, твоя менторка в увлекательный мир Дебат! Жду твой первый запрос");
	});

	bot.command("start", async (ctx) => {
		ctx.session = INITIAL_SESSION;
		await ctx.reply("Привет! Я - Аяу, твоя менторка в увлекательный мир Дебат! Жду твой первый запрос");
	});

	bot.on("text", async (ctx) => {
		ctx.session ??= INITIAL_SESSION;
		const messageText = ctx.message.text;
		await ctx.reply("Сообщение приняла. Жду ответ от сервера");
		await ChatCompaion(ctx, messageText);
	});

	bot.launch();
	process.once("SIGINT", () => bot.stop("SIGINT"));
	process.once("SIGTERM", () => bot.stop("SIGTERM"));
};
