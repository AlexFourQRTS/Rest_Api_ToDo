const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 9999;

// Middleware
app.use(cors());
app.use(express.json());

// Путь к папке с ROM файлами
const ROMS_PATH = path.join(__dirname, './Rom');

// API для получения списка всех ROM файлов
app.get('/api/roms', (req, res) => {
  try {
    const files = fs.readdirSync(ROMS_PATH);
    const nesFiles = files.filter(file => file.endsWith('.nes'));
    
    const roms = nesFiles.map(fileName => {
      const displayName = fileName.replace('.nes', '');
      let gameName = displayName.replace(/\([^)]*\)/g, '').trim();
      gameName = gameName.replace(/\s+/g, ' ');
      
      return {
        id: fileName,
        name: gameName,
        fileName: fileName,
        path: `/api/roms/${fileName}`,
        category: categorizeGame(gameName)
      };
    }).sort((a, b) => a.name.localeCompare(b.name));
    
    res.json(roms);
  } catch (error) {
    console.error('Ошибка чтения папки ROM:', error);
    res.status(500).json({ error: 'Не удалось получить список ROM файлов' });
  }
});

// API для загрузки конкретного ROM файла
app.get('/api/roms/:fileName', (req, res) => {
  try {
    const fileName = req.params.fileName;
    const filePath = path.join(ROMS_PATH, fileName);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'ROM файл не найден' });
    }
    
    // Отправляем файл
    res.sendFile(filePath);
  } catch (error) {
    console.error('Ошибка загрузки ROM файла:', error);
    res.status(500).json({ error: 'Не удалось загрузить ROM файл' });
  }
});

// Функция для категоризации игр
function categorizeGame(gameName) {
  const name = gameName.toLowerCase();
  
  const gameCategories = {
    action: ['action', 'adventure', 'arcade', 'fighting', 'shooter', 'contra', 'burner', 'combat'],
    puzzle: ['puzzle', 'logic', 'brain', 'tetris', 'lolo', 'mahjong'],
    sports: ['sport', 'football', 'baseball', 'basketball', 'tennis', 'racing', 'yard'],
    rpg: ['rpg', 'role', 'dungeon', 'dragon', 'quest', 'advanced'],
    platform: ['platform', 'mario', 'sonic', 'jump', 'donkey', 'adventure', 'island'],
    strategy: ['strategy', 'tactics', 'chess', 'mahjong', 'gun']
  };
  
  for (const [category, keywords] of Object.entries(gameCategories)) {
    if (keywords.some(keyword => name.includes(keyword))) {
      return category;
    }
  }
  
  return 'other';
}

// Статические файлы для клиента
app.use(express.static(path.join(__dirname, '../client/build')));

// Fallback для React Router
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
  console.log(`ROM файлы загружаются из: ${ROMS_PATH}`);
}); 