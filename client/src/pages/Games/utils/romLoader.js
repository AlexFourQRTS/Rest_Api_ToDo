// Утилита для загрузки ROM файлов
// В React с Webpack мы не можем использовать require.context для статических файлов
// Поэтому создадим список игр вручную и будем загружать их по требованию

// Список популярных игр для демонстрации
export const popularGames = [
  {
    id: 'tetris',
    name: 'Tetris',
    fileName: 'Tetris (USA).nes',
    category: 'puzzle',
    demo: true
  },
  {
    id: 'super-mario',
    name: 'Super Mario Bros.',
    fileName: 'Super Mario Bros. (USA).nes',
    category: 'platform',
    demo: true
  },
  {
    id: 'contra',
    name: 'Contra',
    fileName: 'Contra (USA).nes',
    category: 'action',
    demo: true
  },
  {
    id: 'pac-man',
    name: 'Pac-Man',
    fileName: 'Pac-Man (USA).nes',
    category: 'arcade',
    demo: true
  },
  {
    id: 'donkey-kong',
    name: 'Donkey Kong',
    fileName: 'Donkey Kong (USA).nes',
    category: 'platform',
    demo: true
  }
];

// Получаем список всех доступных ROM файлов
export const getAvailableRoms = () => {
  // В реальном приложении здесь был бы запрос к API или импорт из статических файлов
  // Пока возвращаем демо-игры
  return popularGames.map(game => ({
    ...game,
    path: `/roms/${game.fileName}` // Путь для загрузки
  }));
};

// Загружаем конкретный ROM файл
export const loadRom = async (romPath) => {
  try {
    // В реальном приложении здесь была бы загрузка с сервера
    // Пока возвращаем демо-данные
    console.log('Загрузка ROM:', romPath);
    
    // Симуляция загрузки
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Возвращаем демо-данные для тестирования
    const demoRomData = new Uint8Array(32768); // 32KB демо ROM
    demoRomData[0] = 0x4E; // N
    demoRomData[1] = 0x45; // E
    demoRomData[2] = 0x53; // S
    demoRomData[3] = 0x1A; // EOF
    
    return demoRomData;
  } catch (error) {
    console.error('Ошибка загрузки ROM:', error);
    throw new Error('Не удалось загрузить ROM файл');
  }
};

// Поиск игр по названию
export const searchRoms = (query, roms) => {
  if (!query.trim()) return roms;
  
  const searchTerm = query.toLowerCase();
  return roms.filter(rom => 
    rom.name.toLowerCase().includes(searchTerm) ||
    rom.fileName.toLowerCase().includes(searchTerm)
  );
};

// Категории игр для фильтрации
export const gameCategories = {
  action: ['action', 'adventure', 'arcade', 'fighting', 'shooter', 'contra'],
  puzzle: ['puzzle', 'logic', 'brain', 'tetris'],
  sports: ['sport', 'football', 'baseball', 'basketball', 'tennis', 'racing'],
  rpg: ['rpg', 'role', 'dungeon', 'dragon', 'quest'],
  platform: ['platform', 'mario', 'sonic', 'jump', 'donkey'],
  strategy: ['strategy', 'tactics', 'chess', 'mahjong']
};

export const categorizeGame = (gameName) => {
  const name = gameName.toLowerCase();
  
  for (const [category, keywords] of Object.entries(gameCategories)) {
    if (keywords.some(keyword => name.includes(keyword))) {
      return category;
    }
  }
  
  return 'other';
};

// Функция для загрузки реальных ROM файлов с сервера
export const loadRomFromServer = async (fileName) => {
  try {
    const response = await fetch(`/api/roms/${fileName}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const arrayBuffer = await response.arrayBuffer();
    return new Uint8Array(arrayBuffer);
  } catch (error) {
    console.error('Ошибка загрузки ROM с сервера:', error);
    throw new Error('Не удалось загрузить ROM файл с сервера');
  }
}; 