import dotenv from "dotenv";
import { Telegraf, session } from "telegraf";
import { message } from "telegraf/filters";
import { code } from "telegraf/format";
import { ChatCompaion } from "./chat.js";
import { prompts } from "./prompts.js";

dotenv.config();

const telegram_token = process.env.TELEGRAM_TOKEN;

const INITIAL_SESSION = {
  messages: [
    {
      role: "system",
      content:prompts.instruction,
    },
    {
      role: "system",
      content:prompts.niceResolutions,
    },
  ],
};

// Запускаем бота
const bot = new Telegraf(telegram_token);

bot.use(session());

bot.command("new", async (ctx) => {
  ctx.session = INITIAL_SESSION;
  await ctx.reply(
    "Привет! Я - Аяу, твоя менторка в увлекательный мир Дебат! Жду твой первый запрос"
  );
});

bot.command("start", async (ctx) => {
  ctx.session = INITIAL_SESSION;
  await ctx.reply(
    "Привет! Я - Аяу, твоя менторка в увлекательный мир Дебат! Жду твой первый запрос"
  );
});

bot.on(message("text"), async (ctx) => {
  ctx.session ??= INITIAL_SESSION;
  const messageText = ctx.message.text;
  await ctx.reply(code("Сообщение приняла. Жду ответ от сервера"));
  await ChatCompaion(ctx, messageText);
});

bot.launch();

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
