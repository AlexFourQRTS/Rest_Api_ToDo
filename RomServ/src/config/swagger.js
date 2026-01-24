const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Retro Games API',
      version: '1.0.0',
      description: 'Профессиональный API сервер для ретро игр с поддержкой множественных консолей',
      contact: {
        name: 'API Support',
        email: 'support@retrogames.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:9999',
        description: 'Development server'
      },
      {
        url: 'https://api.retrogames.com',
        description: 'Production server'
      }
    ],
    tags: [
      {
        name: 'Consoles',
        description: 'Операции с консолями'
      },
      {
        name: 'Games',
        description: 'Операции с играми'
      },
      {
        name: 'System',
        description: 'Системная информация'
      }
    ],
    components: {
      schemas: {
        Console: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Уникальный идентификатор консоли',
              example: 'nes'
            },
            name: {
              type: 'string',
              description: 'Полное название консоли',
              example: 'Nintendo Entertainment System'
            },
            shortName: {
              type: 'string',
              description: 'Краткое название консоли',
              example: 'NES'
            },
            folder: {
              type: 'string',
              description: 'Путь к папке с играми',
              example: 'Games/NES'
            },
            stats: {
              type: 'number',
              description: 'Количество игр',
              example: 150
            }
          }
        },
        Game: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Идентификатор игры (имя файла)',
              example: 'Super Mario Bros.nes'
            },
            name: {
              type: 'string',
              description: 'Название игры',
              example: 'Super Mario Bros'
            },
            fileName: {
              type: 'string',
              description: 'Имя файла',
              example: 'Super Mario Bros.nes'
            },
            path: {
              type: 'string',
              description: 'Путь для скачивания',
              example: '/consoles/nes/roms/Super%20Mario%20Bros.nes'
            },
            category: {
              type: 'string',
              description: 'Категория игры',
              example: 'platform',
              enum: ['action', 'puzzle', 'sports', 'rpg', 'platform', 'strategy', 'other']
            },
            region: {
              type: 'string',
              description: 'Регион игры',
              example: 'USA',
              enum: ['USA', 'Europe', 'Japan', 'Asia', 'Unknown']
            },
            console: {
              type: 'string',
              description: 'Идентификатор консоли',
              example: 'nes'
            },
            hasImage: {
              type: 'boolean',
              description: 'Наличие изображения',
              example: true
            },
            hasSave: {
              type: 'boolean',
              description: 'Наличие файла сохранения',
              example: false
            },
            imagePath: {
              type: 'string',
              description: 'Путь к изображению',
              example: '/consoles/nes/images/Super Mario Bros.png'
            },
            savePath: {
              type: 'string',
              description: 'Путь к файлу сохранения',
              example: '/consoles/nes/saves/Super Mario Bros.srm'
            }
          }
        },
        GameStats: {
          type: 'object',
          properties: {
            total: {
              type: 'number',
              description: 'Общее количество игр',
              example: 1500
            },
            categories: {
              type: 'object',
              description: 'Статистика по категориям',
              example: {
                action: 300,
                puzzle: 150,
                sports: 200,
                rpg: 100,
                platform: 400,
                strategy: 50,
                other: 300
              }
            },
            regions: {
              type: 'object',
              description: 'Статистика по регионам',
              example: {
                USA: 800,
                Europe: 400,
                Japan: 200,
                Asia: 50,
                Unknown: 50
              }
            },
            consoles: {
              type: 'object',
              description: 'Статистика по консолям',
              example: {
                nes: 500,
                megadrive: 300,
                snes: 400,
                gba: 200,
                gbc: 100
              }
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            error: {
              type: 'object',
              properties: {
                message: {
                  type: 'string',
                  example: 'Game file not found'
                },
                status: {
                  type: 'number',
                  example: 404
                },
                timestamp: {
                  type: 'string',
                  format: 'date-time',
                  example: '2024-06-23T14:30:00.000Z'
                },
                path: {
                  type: 'string',
                  example: '/consoles/nes/games/unknown.nes'
                },
                method: {
                  type: 'string',
                  example: 'GET'
                }
              }
            }
          }
        },
        Success: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            data: {
              type: 'object',
              description: 'Данные ответа'
            },
            meta: {
              type: 'object',
              description: 'Метаданные ответа',
              properties: {
                total: {
                  type: 'number',
                  example: 150
                },
                console: {
                  type: 'string',
                  example: 'nes'
                },
                consoleName: {
                  type: 'string',
                  example: 'Nintendo Entertainment System'
                }
              }
            }
          }
        }
      },
      parameters: {
        consoleId: {
          name: 'consoleId',
          in: 'path',
          required: true,
          description: 'Идентификатор консоли',
          schema: {
            type: 'string',
            enum: ['nes', 'megadrive', 'snes', 'gba', 'gbc', 'psx', 'atari']
          },
          example: 'nes'
        },
        fileName: {
          name: 'fileName',
          in: 'path',
          required: true,
          description: 'Имя файла игры',
          schema: {
            type: 'string'
          },
          example: 'Super Mario Bros.nes'
        },
        page: {
          name: 'page',
          in: 'query',
          required: false,
          description: 'Номер страницы',
          schema: {
            type: 'integer',
            minimum: 1,
            default: 1
          },
          example: 1
        },
        limit: {
          name: 'limit',
          in: 'query',
          required: false,
          description: 'Количество элементов на странице',
          schema: {
            type: 'integer',
            minimum: 1,
            maximum: 100,
            default: 50
          },
          example: 20
        },
        sortBy: {
          name: 'sortBy',
          in: 'query',
          required: false,
          description: 'Поле для сортировки',
          schema: {
            type: 'string',
            enum: ['name', 'category', 'region', 'fileName'],
            default: 'name'
          },
          example: 'name'
        },
        sortOrder: {
          name: 'sortOrder',
          in: 'query',
          required: false,
          description: 'Порядок сортировки',
          schema: {
            type: 'string',
            enum: ['asc', 'desc'],
            default: 'asc'
          },
          example: 'asc'
        },
        category: {
          name: 'category',
          in: 'query',
          required: false,
          description: 'Фильтр по категории',
          schema: {
            type: 'string',
            enum: ['action', 'puzzle', 'sports', 'rpg', 'platform', 'strategy', 'other']
          },
          example: 'action'
        },
        region: {
          name: 'region',
          in: 'query',
          required: false,
          description: 'Фильтр по региону',
          schema: {
            type: 'string',
            enum: ['USA', 'Europe', 'Japan', 'Asia', 'Unknown']
          },
          example: 'USA'
        },
        search: {
          name: 'q',
          in: 'query',
          required: true,
          description: 'Поисковый запрос',
          schema: {
            type: 'string',
            minLength: 1
          },
          example: 'mario'
        }
      }
    }
  },
  apis: ['./src/routes/*.js', './src/controllers/*.js']
};

const specs = swaggerJsdoc(options);

module.exports = specs; 