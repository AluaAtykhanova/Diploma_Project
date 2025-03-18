const fs = require('fs');
const path = require('path');

const outputFile = 'all_code.txt';
const rootDir = './'; // Корневая папка проекта
//node mergeProject.js

function getAllFiles(dirPath, arrayOfFiles) {
    const files = fs.readdirSync(dirPath);

    arrayOfFiles = arrayOfFiles || [];

    files.forEach(function(file) {
        const fullPath = path.join(dirPath, file);

        if (fs.statSync(fullPath).isDirectory()) {
            arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
        } else {
            if (file.endsWith('.js') || file.endsWith('.ts') || file.endsWith('.json')) { // Добавьте нужные форматы
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
    console.log(`✅ Все файлы объединены в ${outputFile}`);
}

mergeFiles();
