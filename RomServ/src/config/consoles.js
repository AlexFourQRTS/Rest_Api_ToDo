const path = require('path');

const CONSOLES_CONFIG = {

  nes: {
    name: 'Nintendo Entertainment System',
    shortName: 'NES',
    folder: 'Games/NES',
    extensions: ['.nes'],
    imageExtensions: ['.png', '.jpg', '.jpeg'],
    saveExtensions: ['.srm'],
    maxFileSize: 2 * 1024 * 1024,
    supportedRegions: ['USA', 'Europe', 'Japan', 'Asia'],
    categories: {
      action: ['action', 'adventure', 'arcade', 'fighting', 'shooter', 'contra', 'burner', 'combat'],
      puzzle: ['puzzle', 'logic', 'brain', 'tetris', 'lolo', 'mahjong'],
      sports: ['sport', 'football', 'baseball', 'basketball', 'tennis', 'racing', 'yard'],
      rpg: ['rpg', 'role', 'dungeon', 'dragon', 'quest', 'advanced'],
      platform: ['platform', 'mario', 'sonic', 'jump', 'donkey', 'adventure', 'island'],
      strategy: ['strategy', 'tactics', 'chess', 'mahjong', 'gun']
    }
  },

  megadrive: {
    name: 'Sega Mega Drive / Genesis',
    shortName: 'Mega Drive',
    folder: 'Games/Megadrive',
    extensions: ['.bin', '.md', '.gen'],
    imageExtensions: ['.png', '.jpg', '.jpeg'],
    saveExtensions: ['.srm'],
    maxFileSize: 4 * 1024 * 1024,
    supportedRegions: ['USA', 'Europe', 'Japan', 'Asia'],
    categories: {
      action: ['action', 'adventure', 'arcade', 'fighting', 'shooter', 'combat'],
      puzzle: ['puzzle', 'logic', 'brain', 'tetris'],
      sports: ['sport', 'football', 'baseball', 'basketball', 'tennis', 'racing'],
      rpg: ['rpg', 'role', 'dungeon', 'dragon', 'quest', 'phantasy', 'shining'],
      platform: ['platform', 'sonic', 'jump', 'adventure'],
      strategy: ['strategy', 'tactics', 'chess']
    }
  },

  snes: {
    name: 'Super Nintendo Entertainment System',
    shortName: 'Super Nintendo',
    folder: 'Games/SuperNintendo',
    extensions: ['.smc', '.sfc', '.fig'],
    imageExtensions: ['.png', '.jpg', '.jpeg'],
    saveExtensions: ['.srm'],
    maxFileSize: 4 * 1024 * 1024,
    supportedRegions: ['USA', 'Europe', 'Japan', 'Asia'],
    categories: {
      action: ['action', 'adventure', 'arcade', 'fighting', 'shooter'],
      puzzle: ['puzzle', 'logic', 'brain', 'tetris'],
      sports: ['sport', 'football', 'baseball', 'basketball', 'tennis', 'racing'],
      rpg: ['rpg', 'role', 'dungeon', 'dragon', 'quest', 'final', 'chrono'],
      platform: ['platform', 'mario', 'sonic', 'jump', 'donkey'],
      strategy: ['strategy', 'tactics', 'chess']
    }
  },

  gba: {
    name: 'Game Boy Advance',
    shortName: 'Game Boy Advance',
    folder: 'Games/GameBoyAdvance',
    extensions: ['.gba'],
    imageExtensions: ['.png', '.jpg', '.jpeg'],
    saveExtensions: ['.sav'],
    maxFileSize: 32 * 1024 * 1024,
    supportedRegions: ['USA', 'Europe', 'Japan', 'Asia'],
    categories: {
      action: ['action', 'adventure', 'arcade', 'fighting', 'shooter'],
      puzzle: ['puzzle', 'logic', 'brain', 'tetris'],
      sports: ['sport', 'football', 'baseball', 'basketball', 'tennis', 'racing'],
      rpg: ['rpg', 'role', 'dungeon', 'dragon', 'quest', 'pokemon'],
      platform: ['platform', 'mario', 'sonic', 'jump'],
      strategy: ['strategy', 'tactics', 'chess']
    }
  },

  gbc: {
    name: 'Game Boy Color',
    shortName: 'Game Boy Color',
    folder: 'Games/GameBoyColor',
    extensions: ['.gbc', '.gb'],
    imageExtensions: ['.png', '.jpg', '.jpeg'],
    saveExtensions: ['.sav'],
    maxFileSize: 2 * 1024 * 1024,
    supportedRegions: ['USA', 'Europe', 'Japan', 'Asia'],
    categories: {
      action: ['action', 'adventure', 'arcade', 'fighting', 'shooter'],
      puzzle: ['puzzle', 'logic', 'brain', 'tetris'],
      sports: ['sport', 'football', 'baseball', 'basketball', 'tennis', 'racing'],
      rpg: ['rpg', 'role', 'dungeon', 'dragon', 'quest', 'pokemon'],
      platform: ['platform', 'mario', 'sonic', 'jump'],
      strategy: ['strategy', 'tactics', 'chess']
    }
  },

  psx: {
    name: 'PlayStation',
    shortName: 'PlayStation X',
    folder: 'Games/PlayStationX',
    extensions: ['.iso', '.bin', '.img'],
    imageExtensions: ['.png', '.jpg', '.jpeg'],
    saveExtensions: ['.mcr'],
    maxFileSize: 700 * 1024 * 1024,
    supportedRegions: ['USA', 'Europe', 'Japan', 'Asia'],
    categories: {
      action: ['action', 'adventure', 'arcade', 'fighting', 'shooter'],
      puzzle: ['puzzle', 'logic', 'brain'],
      sports: ['sport', 'football', 'baseball', 'basketball', 'tennis', 'racing'],
      rpg: ['rpg', 'role', 'dungeon', 'dragon', 'quest', 'final'],
      platform: ['platform', 'crash', 'spyro'],
      strategy: ['strategy', 'tactics']
    }
  },

  atari: {
    name: 'Atari 2600',
    shortName: 'Atari',
    folder: 'Games/Atari',
    extensions: ['.a26', '.bin', '.rom'],
    imageExtensions: ['.png', '.jpg', '.jpeg'],
    saveExtensions: ['.sav'],
    maxFileSize: 64 * 1024,
    supportedRegions: ['USA', 'Europe', 'Japan'],
    categories: {
      action: ['action', 'adventure', 'arcade', 'fighting', 'shooter'],
      puzzle: ['puzzle', 'logic', 'brain'],
      sports: ['sport', 'football', 'baseball', 'basketball', 'tennis', 'racing'],
      platform: ['platform', 'adventure'],
      strategy: ['strategy', 'tactics']
    }
  }
};

function getConsoleConfig(consoleId) {
  return CONSOLES_CONFIG[consoleId] || null;
}

function getConsolePath(consoleId) {
  const config = getConsoleConfig(consoleId);
  if (!config) return null;
  return path.join(process.cwd(), config.folder);
}

function getAllConsoles() {
  return Object.keys(CONSOLES_CONFIG).map(id => ({
    id,
    name: CONSOLES_CONFIG[id].name,
    shortName: CONSOLES_CONFIG[id].shortName,
    folder: CONSOLES_CONFIG[id].folder
  }));
}

module.exports = {
  CONSOLES_CONFIG,
  getConsoleConfig,
  getConsolePath,
  getAllConsoles
}; 