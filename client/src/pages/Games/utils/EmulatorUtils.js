// Утилиты для работы с эмуляторами

export class GameBoyEmulator {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.isRunning = false;
    this.romData = null;
    this.frameCount = 0;
    this.lastTime = 0;
    
    // Настройка canvas
    this.canvas.width = 160;
    this.canvas.height = 144;
    this.ctx.imageSmoothingEnabled = false;
    
    // Состояние эмулятора
    this.memory = new Uint8Array(0x10000); // 64KB памяти
    this.registers = {
      a: 0, b: 0, c: 0, d: 0, e: 0, h: 0, l: 0, f: 0,
      sp: 0xFFFE, pc: 0x0100
    };
    
    // Графический буфер
    this.screenBuffer = new Uint8Array(160 * 144 * 4);
    
    // Обработчики клавиш
    this.keys = {
      up: false, down: false, left: false, right: false,
      a: false, b: false, start: false, select: false
    };
    
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Обработка клавиатуры
    document.addEventListener('keydown', (e) => {
      switch(e.code) {
        case 'ArrowUp': this.keys.up = true; break;
        case 'ArrowDown': this.keys.down = true; break;
        case 'ArrowLeft': this.keys.left = true; break;
        case 'ArrowRight': this.keys.right = true; break;
        case 'KeyZ': this.keys.a = true; break;
        case 'KeyX': this.keys.b = true; break;
        case 'Enter': this.keys.start = true; break;
        case 'ShiftLeft': this.keys.select = true; break;
      }
    });

    document.addEventListener('keyup', (e) => {
      switch(e.code) {
        case 'ArrowUp': this.keys.up = false; break;
        case 'ArrowDown': this.keys.down = false; break;
        case 'ArrowLeft': this.keys.left = false; break;
        case 'ArrowRight': this.keys.right = false; break;
        case 'KeyZ': this.keys.a = false; break;
        case 'KeyX': this.keys.b = false; break;
        case 'Enter': this.keys.start = false; break;
        case 'ShiftLeft': this.keys.select = false; break;
      }
    });
  }

  loadROM(romData) {
    this.romData = new Uint8Array(romData);
    
    // Копируем ROM в память (первые 32KB)
    const romSize = Math.min(this.romData.length, 0x8000);
    this.memory.set(this.romData.slice(0, romSize), 0);
    
    console.log(`ROM загружено: ${romSize} байт`);
    return true;
  }

  start() {
    if (!this.romData) {
      console.error('ROM не загружено');
      return false;
    }
    
    this.isRunning = true;
    this.gameLoop();
    console.log('Эмулятор запущен');
    return true;
  }

  stop() {
    this.isRunning = false;
    console.log('Эмулятор зупинено');
  }

  reset() {
    // Сброс регистров
    this.registers = {
      a: 0, b: 0, c: 0, d: 0, e: 0, h: 0, l: 0, f: 0,
      sp: 0xFFFE, pc: 0x0100
    };
    
    // Очистка экрана
    this.clearScreen();
    
    console.log('Емулятор скинуто');
  }

  clearScreen() {
    this.ctx.fillStyle = '#0f380f'; // Классический зеленый цвет GameBoy
    this.ctx.fillRect(0, 0, 160, 144);
  }

  // Простая эмуляция CPU (базовая)
  executeInstruction() {
    if (!this.isRunning) return;
    
    const opcode = this.memory[this.registers.pc];
    
    // Простая эмуляция нескольких инструкций
    switch(opcode) {
      case 0x00: // NOP
        this.registers.pc++;
        break;
      case 0x3E: // LD A, n
        this.registers.pc++;
        this.registers.a = this.memory[this.registers.pc];
        this.registers.pc++;
        break;
      case 0x32: // LD (HL-), A
        const hl = (this.registers.h << 8) | this.registers.l;
        this.memory[hl] = this.registers.a;
        this.registers.l = (this.registers.l - 1) & 0xFF;
        if (this.registers.l === 0xFF) {
          this.registers.h = (this.registers.h - 1) & 0xFF;
        }
        this.registers.pc++;
        break;
      default:
        // Неизвестная инструкция - просто пропускаем
        this.registers.pc++;
        break;
    }
  }

  // Простая эмуляция графики
  updateGraphics() {
    // Создаем простой паттерн для демонстрации
    const time = Date.now() * 0.001;
    
    for (let y = 0; y < 144; y++) {
      for (let x = 0; x < 160; x++) {
        const index = (y * 160 + x) * 4;
        
        // Создаем простую анимацию
        const value = Math.sin(x * 0.1 + time) * Math.cos(y * 0.1 + time);
        const color = Math.floor((value + 1) * 127);
        
        // GameBoy палитра (4 оттенка зеленого)
        let gbColor;
        if (color < 64) gbColor = 0x0f380f; // Темно-зеленый
        else if (color < 128) gbColor = 0x306230; // Средне-зеленый
        else if (color < 192) gbColor = 0x8bac0f; // Светло-зеленый
        else gbColor = 0x9bbc0f; // Очень светло-зеленый
        
        // Устанавливаем цвет пикселя
        this.screenBuffer[index] = (gbColor >> 16) & 0xFF;     // R
        this.screenBuffer[index + 1] = (gbColor >> 8) & 0xFF;  // G
        this.screenBuffer[index + 2] = gbColor & 0xFF;         // B
        this.screenBuffer[index + 3] = 255;                    // A
      }
    }
    
    // Обновляем canvas
    const imageData = new ImageData(
      new Uint8ClampedArray(this.screenBuffer),
      160,
      144
    );
    this.ctx.putImageData(imageData, 0, 0);
  }

  gameLoop() {
    if (!this.isRunning) return;
    
    const currentTime = performance.now();
    const deltaTime = currentTime - this.lastTime;
    
    // 60 FPS
    if (deltaTime >= 16.67) {
      // Выполняем несколько инструкций
      for (let i = 0; i < 1000; i++) {
        this.executeInstruction();
      }
      
      // Обновляем графику
      this.updateGraphics();
      
      this.lastTime = currentTime;
      this.frameCount++;
    }
    
    requestAnimationFrame(() => this.gameLoop());
  }
}

export class NESEmulator {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.isRunning = false;
    this.romData = null;
    this.frameCount = 0;
    this.lastTime = 0;
    
    // Настройка canvas
    this.canvas.width = 256;
    this.canvas.height = 240;
    this.ctx.imageSmoothingEnabled = false;
    
    // Состояние эмулятора
    this.memory = new Uint8Array(0x10000); // 64KB памяти
    this.registers = {
      a: 0, x: 0, y: 0, sp: 0xFD, pc: 0xC000, status: 0x34
    };
    
    // Графический буфер
    this.screenBuffer = new Uint8Array(256 * 240 * 4);
    
    // Обработчики клавиш
    this.keys = {
      up: false, down: false, left: false, right: false,
      a: false, b: false, start: false, select: false
    };
    
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Обработка клавиатуры
    document.addEventListener('keydown', (e) => {
      switch(e.code) {
        case 'ArrowUp': this.keys.up = true; break;
        case 'ArrowDown': this.keys.down = true; break;
        case 'ArrowLeft': this.keys.left = true; break;
        case 'ArrowRight': this.keys.right = true; break;
        case 'KeyZ': this.keys.a = true; break;
        case 'KeyX': this.keys.b = true; break;
        case 'Enter': this.keys.start = true; break;
        case 'ShiftLeft': this.keys.select = true; break;
      }
    });

    document.addEventListener('keyup', (e) => {
      switch(e.code) {
        case 'ArrowUp': this.keys.up = false; break;
        case 'ArrowDown': this.keys.down = false; break;
        case 'ArrowLeft': this.keys.left = false; break;
        case 'ArrowRight': this.keys.right = false; break;
        case 'KeyZ': this.keys.a = false; break;
        case 'KeyX': this.keys.b = false; break;
        case 'Enter': this.keys.start = false; break;
        case 'ShiftLeft': this.keys.select = false; break;
      }
    });
  }

  loadROM(romData) {
    this.romData = new Uint8Array(romData);
    
    // Проверяем заголовок NES
    if (this.romData[0] !== 0x4E || this.romData[1] !== 0x45 || 
        this.romData[2] !== 0x53 || this.romData[3] !== 0x1A) {
      console.error('Неверный формат NES ROM');
      return false;
    }
    
    // Копируем PRG ROM (программный код)
    const prgSize = this.romData[4] * 16384; // 16KB банки
    const prgStart = 16;
    this.memory.set(this.romData.slice(prgStart, prgStart + prgSize), 0x8000);
    
    // Копируем в нижнюю память для зеркалирования
    if (prgSize === 16384) {
      this.memory.set(this.romData.slice(prgStart, prgStart + 16384), 0xC000);
    }
    
    console.log(`NES ROM загружено: ${prgSize} байт PRG`);
    return true;
  }

  start() {
    if (!this.romData) {
      console.error('ROM не загружено');
      return false;
    }
    
    this.isRunning = true;
    this.gameLoop();
    console.log('NES эмулятор запущен');
    return true;
  }

  stop() {
    this.isRunning = false;
    console.log('NES эмулятор зупинено');
  }

  reset() {
    this.registers = {
      a: 0, x: 0, y: 0, sp: 0xFD, pc: 0xC000, status: 0x34
    };
    this.clearScreen();
    console.log('NES эмулятор скинуто');
  }

  clearScreen() {
    this.ctx.fillStyle = '#000000';
    this.ctx.fillRect(0, 0, 256, 240);
  }

  executeInstruction() {
    if (!this.isRunning) return;
    
    const opcode = this.memory[this.registers.pc];
    
    // Простая эмуляция нескольких NES инструкций
    switch(opcode) {
      case 0x00: // BRK
        this.registers.pc++;
        break;
      case 0xA9: // LDA immediate
        this.registers.pc++;
        this.registers.a = this.memory[this.registers.pc];
        this.registers.pc++;
        break;
      case 0x8D: // STA absolute
        this.registers.pc++;
        const addr = this.memory[this.registers.pc] | (this.memory[this.registers.pc + 1] << 8);
        this.memory[addr] = this.registers.a;
        this.registers.pc += 2;
        break;
      default:
        this.registers.pc++;
        break;
    }
  }

  updateGraphics() {
    const time = Date.now() * 0.001;
    
    for (let y = 0; y < 240; y++) {
      for (let x = 0; x < 256; x++) {
        const index = (y * 256 + x) * 4;
        
        // Создаем простую анимацию для NES
        const value = Math.sin(x * 0.05 + time) * Math.cos(y * 0.05 + time);
        const color = Math.floor((value + 1) * 127);
        
        // NES палитра (более яркие цвета)
        let nesColor;
        if (color < 64) nesColor = 0x000000;      // Черный
        else if (color < 128) nesColor = 0x555555; // Серый
        else if (color < 192) nesColor = 0xAAAAAA; // Светло-серый
        else nesColor = 0xFFFFFF;                  // Белый
        
        this.screenBuffer[index] = (nesColor >> 16) & 0xFF;
        this.screenBuffer[index + 1] = (nesColor >> 8) & 0xFF;
        this.screenBuffer[index + 2] = nesColor & 0xFF;
        this.screenBuffer[index + 3] = 255;
      }
    }
    
    const imageData = new ImageData(
      new Uint8ClampedArray(this.screenBuffer),
      256,
      240
    );
    this.ctx.putImageData(imageData, 0, 0);
  }

  gameLoop() {
    if (!this.isRunning) return;
    
    const currentTime = performance.now();
    const deltaTime = currentTime - this.lastTime;
    
    // 60 FPS
    if (deltaTime >= 16.67) {
      // Выполняем несколько инструкций
      for (let i = 0; i < 1000; i++) {
        this.executeInstruction();
      }
      
      this.updateGraphics();
      this.lastTime = currentTime;
      this.frameCount++;
    }
    
    requestAnimationFrame(() => this.gameLoop());
  }
}

// Утилиты для работы с файлами
export const loadROMFile = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      resolve(e.target.result);
    };
    
    reader.onerror = () => {
      reject(new Error('Помилка читання файлу'));
    };
    
    reader.readAsArrayBuffer(file);
  });
};

// Определение типа эмулятора по расширению файла
export const getEmulatorType = (filename) => {
  const ext = filename.toLowerCase().split('.').pop();
  
  switch(ext) {
    case 'gb':
    case 'gbc':
      return 'gameboy';
    case 'nes':
      return 'nes';
    default:
      return null;
  }
}; 