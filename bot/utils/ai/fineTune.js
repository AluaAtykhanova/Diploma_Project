require('dotenv').config();
const OpenAI = require('openai');
const dotenv = require('dotenv');
// node .\bot\utils\ai\addDataSet.js
dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY_2,  // Используем тот же ключ
});

// Вставь свой file_id сюда!
const FILE_ID = 'file-UthQhSCvW8WKQ1hqWyKBJh';  // <-- Подставь сюда свой file_id

async function fineTune() {
    try {
        const response = await openai.fineTuning.jobs.create({
            training_file: FILE_ID,
            model: "gpt-3.5-turbo",
        });

        console.log("🚀 Fine-tuning запущен! job_id:", response.id);
    } catch (error) {
        console.error("❌ Ошибка при запуске fine-tuning:", error);
    }
}

fineTune();
