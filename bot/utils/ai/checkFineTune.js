require('dotenv').config();
const OpenAI = require('openai');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY_2,
});

// Вставь свой job_id сюда!
const JOB_ID = 'ftjob-MeFog6p0dxQG1Huy8wdDsan2';  // <-- Подставь сюда свой job_id

async function checkFineTune() {
    try {
        const response = await openai.fineTuning.jobs.retrieve(JOB_ID);
        console.log("📊 Статус fine-tuning:", response.status);
        console.log("🆔 Обученная модель:", response.fine_tuned_model);
    } catch (error) {
        console.error("❌ Ошибка при проверке статуса:", error);
    }
}

checkFineTune();
