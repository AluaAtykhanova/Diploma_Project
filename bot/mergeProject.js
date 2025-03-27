const fs = require('fs');
const path = require('path');

const outputFile = 'all_code.txt';
const rootDir = './'; // Корневая папка проекта
const excludedDir = path.join(rootDir, 'bot/utils/ai'); // Папка, которую исключаем

function getAllFiles(dirPath, arrayOfFiles) {
    const files = fs.readdirSync(dirPath);
    arrayOfFiles = arrayOfFiles || [];

    files.forEach(function(file) {
        const fullPath = path.join(dirPath, file);

        // Игнорируем папку bot/utils/ai
        if (fullPath.startsWith(excludedDir)) {
            return; // Пропускаем этот путь
        }

        if (fs.statSync(fullPath).isDirectory()) {
            arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
        } else {
            if (file.endsWith('.js') || file.endsWith('.ts') || file.endsWith('.json')) {
                arrayOfFiles.push(fullPath);
            }
        }
    });

    return arrayOfFiles;
}

function mergeFiles() {
    const files = getAllFiles(rootDir);
    let mergedContent = '';

    files.forEach(file => {
        mergedContent += `\n// ${file}\n`;
        mergedContent += fs.readFileSync(file, 'utf8');
        mergedContent += '\n\n';
    });

    fs.writeFileSync(outputFile, mergedContent, 'utf8');
    console.log(`✅ Все файлы объединены в ${outputFile}, кроме /bot/utils/ai`);
}

mergeFiles();
//node mergeProject.js
