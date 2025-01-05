import fs from 'fs';
import path from 'path';
import { format } from 'date-fns';  // Для формата даты

// Директории для логов
const logsDir = path.join('storage', 'logs');
const errorLogDir = path.join(logsDir, 'errors');
const appLogDir = path.join(logsDir, 'app');

// Проверка и создание директорий для логов, если они не существуют
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

if (!fs.existsSync(errorLogDir)) {
  fs.mkdirSync(errorLogDir, { recursive: true });
}

if (!fs.existsSync(appLogDir)) {
  fs.mkdirSync(appLogDir, { recursive: true });
}

// Генерация имени файла на основе текущей даты (например, errors-2024-12-10.log)
const getLogFileName = () => {
  const currentDate = format(new Date(), 'yyyy-MM-dd');
  return `${currentDate}.log`;
};

// Путь к текущим лог-файлам
const currentErrorLogFile = path.join(errorLogDir, `errors-${getLogFileName()}`);
const currentAppLogFile = path.join(appLogDir, `app-${getLogFileName()}`);

// Запись ошибки в лог ошибок
export const logError = (message) => {
  const logEntry = `[ERROR] [${new Date().toISOString()}]: ${message}\n`;
  fs.appendFileSync(currentErrorLogFile, logEntry, 'utf8');
};

// Запись информации в лог обычных приложений
export const logInfo = (message) => {
  const logEntry = `[INFO] [${new Date().toISOString()}]: ${message}\n`;
  fs.appendFileSync(currentAppLogFile, logEntry, 'utf8');
};

// Функция для удаления старых логов (старше 30 дней) для каждой папки
const deleteOldLogs = (logDir) => {
  const files = fs.readdirSync(logDir);
  const currentDate = new Date();

  files.forEach((file) => {
    const filePath = path.join(logDir, file);
    const stats = fs.statSync(filePath);
    const fileDate = new Date(file.split('-')[0]); // Извлекаем дату из имени файла (например, errors-2024-12-10.log)

    // Если файл старше 30 дней, удаляем его
    if ((currentDate - fileDate) / (1000 * 60 * 60 * 24) > 30) {
      fs.unlinkSync(filePath);
      console.log(`Удален старый лог: ${file}`);
    }
  });
};

// Удаление старых логов для обеих папок
deleteOldLogs(errorLogDir);
deleteOldLogs(appLogDir);
