// API для работы с ROM файлами

// Базовый URL сервера
const API_BASE_URL = 'http://localhost:9999';

// Список всех доступных ROM файлов (из папки utils/Rom)
const romFiles = [
  'Tetris (USA).nes',
  'Super Mario Bros. (USA).nes',
  'Contra (USA).nes',
  'Pac-Man (USA).nes',
  'Donkey Kong (USA).nes',
  '1942 (Japan, USA).nes',
  '1943 - The Battle of Midway (USA).nes',
  '10-Yard Fight (USA, Europe).nes',
  'Adventure Island (Europe).nes',
  'Adventure Island II (USA).nes',
  'Adventure Island 3 (USA).nes',
  'Adventure Island 4.nes',
  'Adventures of Lolo (USA).nes',
  'Adventures of Lolo 2 (USA).nes',
  'Adventures of Lolo 3 (USA).nes',
  'Adventures of Bayou Billy, The (USA).nes',
  'Adventures of Dino Riki (USA).nes',
  'Adventures of Gilligan\'s Island, The (USA).nes',
  'Adventures of Rad Gravity, The (USA).nes',
  'Adventures of Rocky and Bullwinkle and Friends, The (USA).nes',
  'Adventures of Tom Sawyer (USA).nes',
  'After Burner (Japan).nes',
  'After Burner (USA) (Unl).nes',
  'Air Combat 1943 Invincible Edition.nes',
  'Aigina no Yogen - Balubalouk no Densetsu Yori (Japan).nes',
  'Ai Sensei no Oshiete - Watashi no Hoshi (Japan).nes',
  'Abadox (Japan).nes',
  'Abadox - The Deadly Inner War (USA).nes',
  'Abarenbou Tengu (Japan).nes',
  'Abbe Road X.nes',
  'Aces - Iron Eagle 3 (Japan).nes',
  'Action 52 (USA) (Rev A) (Unl).nes',
  'Action 52 (USA) (Unl).nes',
  'Action 4 in 1.nes',
  'Action in New York (Europe).nes',
  'Adan y Eva (Spain) (Gluk Video) (Unl).nes',
  'Addams Family, The (Europe) (En,Fr,De).nes',
  'Addams Family, The (USA).nes',
  'Addams Family, The - Pugsley\'s Scavenger Hunt (Europe).nes',
  'Addams Family, The - Pugsley\'s Scavenger Hunt (USA).nes',
  'Addams Family, The - Uncle Fester\'s Quest (USA) (Beta).nes',
  'Advanced Dungeons & Dragons - Dragons of Flame (Japan).nes',
  'Advanced Dungeons & Dragons - Heroes of the Lance (Japan).nes',
  'Advanced Dungeons & Dragons - Heroes of the Lance (USA).nes',
  'Advanced Dungeons & Dragons - DragonStrike (USA).nes',
  'Advanced Dungeons & Dragons - Hillsfar (Japan).nes',
  'Advanced Dungeons & Dragons - Pool of Radiance (Japan).nes',
  'Advanced Dungeons & Dragons - Hillsfar (USA).nes',
  'Advanced Dungeons & Dragons - Pool of Radiance (USA).nes',
  'Adventure Island 2 (Chinese version).nes',
  'Adventure Island 3 (Chinese version).nes',
  'Adventure Island 4 (Chinese version).nes',
  'Adventure Island Classic (Europe).nes',
  'Adventure Island Invincible Edition (HACK).nes',
  'Adventure Island Part II, The (Europe).nes',
  'Adventure kid Jack.nes',
  'Adventure team.nes',
  'Adventures in the Magic Kingdom (Europe).nes',
  'Adventures in the Magic Kingdom (USA).nes',
  'Adventures of Dragon Cave 1.nes',
  '720 Degrees (USA).nes',
  '8 Eyes (Japan).nes',
  '8 Eyes (USA).nes',
  'A Ressha de Ikou (Japan).nes',
  'Aa Yakyuu Jinsei Icchokusen (Japan).nes',
  '1991 Du Ma Racing (Asia) (Unl).nes',
  '1999 - Hore, Mitakotoka! Seikimatsu (Japan).nes',
  '2010 - Street Fighter (Japan).nes',
  '25th Anniversary Super Mario Bros. (Europe) (Promo, Virtual Console).nes',
  '3 in 1 Supergun (Asia) (Unl).nes',
  '3-D Block (Asia) (Hwang Shinwei) (Unl).nes',
  '3-D Block (Asia) (RCM Group) (Unl).nes',
  '3-D WorldRunner (USA).nes',
  '4 Nin Uchi Mahjong (Japan).nes',
  '4 Nin Uchi Mahjong (Japan) (Rev A).nes',
  '16 channel truck.nes',
  '100 Man Dollar Kid - Maboroshi no Teiou Hen (Japan).nes',
  '89 Dennou Kyuusei Uranai (Japan).nes',
  '10-Yard Fight (Japan) (Rev 1).nes',
  '10-Yard Fight (Japan).nes'
];

// Функция для получения списка всех ROM файлов с сервера
export const getAllRoms = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/roms`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const roms = await response.json();
    return roms;
  } catch (error) {
    console.error('Ошибка получения списка ROM файлов:', error);
    // Возвращаем демо-игры в случае ошибки
    return getDemoRoms();
  }
};

// Демо-игры для fallback
const getDemoRoms = () => {
  const demoGames = [
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

  return demoGames.map(game => ({
    ...game,
    path: `${API_BASE_URL}/api/roms/${game.fileName}`
  }));
};

// Функция для загрузки ROM файла с сервера
export const loadRomFile = async (fileName) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/roms/${fileName}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const arrayBuffer = await response.arrayBuffer();
    return new Uint8Array(arrayBuffer);
  } catch (error) {
    console.error('Ошибка загрузки ROM файла:', error);
    throw new Error(`Не удалось загрузить ROM файл: ${fileName}`);
  }
};

// Категории игр
const gameCategories = {
  action: ['action', 'adventure', 'arcade', 'fighting', 'shooter', 'contra', 'burner', 'combat'],
  puzzle: ['puzzle', 'logic', 'brain', 'tetris', 'lolo', 'mahjong'],
  sports: ['sport', 'football', 'baseball', 'basketball', 'tennis', 'racing', 'yard'],
  rpg: ['rpg', 'role', 'dungeon', 'dragon', 'quest', 'advanced'],
  platform: ['platform', 'mario', 'sonic', 'jump', 'donkey', 'adventure', 'island'],
  strategy: ['strategy', 'tactics', 'chess', 'mahjong', 'gun']
};

// Функция для категоризации игры
const categorizeGame = (gameName) => {
  const name = gameName.toLowerCase();
  
  for (const [category, keywords] of Object.entries(gameCategories)) {
    if (keywords.some(keyword => name.includes(keyword))) {
      return category;
    }
  }
  
  return 'other';
};

// Функция для поиска игр
export const searchRoms = (query, roms) => {
  if (!query.trim()) return roms;
  
  const searchTerm = query.toLowerCase();
  return roms.filter(rom => 
    rom.name.toLowerCase().includes(searchTerm) ||
    rom.fileName.toLowerCase().includes(searchTerm)
  );
};

// Функция для фильтрации по категории
export const filterRomsByCategory = (category, roms) => {
  if (category === 'all') return roms;
  return roms.filter(rom => rom.category === category);
}; 