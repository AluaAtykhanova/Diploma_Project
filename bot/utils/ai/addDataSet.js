require('dotenv').config();
const fs = require('fs');
const OpenAI = require('openai');
const dotenv = require('dotenv');
// node .\bot\utils\ai\addDataSet.js
dotenv.config();
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY_2,
});

async function addDataSet() {
    try {
        const response = await openai.files.create({
            file: fs.createReadStream("./bot/utils/ai/resolutions_dataset.jsonl"), // Укажи путь к файлу
            purpose: "fine-tune",
        });
        console.log("✅ Файл загружен! file_id:", response.id);
    } catch (error) {
        console.error("❌ Ошибка загрузки файла:", error);
    }
}

addDataSet();
