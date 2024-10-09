import {Telegraf} from 'telegraf'
import dotenv from 'dotenv';
dotenv.config();

const bot = new Telegraf(process.env.TELEGRAM_TOKEN)

bot.command('start', async(ctx) => {
    await ctx.reply(JSON.stringify(ctx.message,null,2))
})

bot.launch()

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))