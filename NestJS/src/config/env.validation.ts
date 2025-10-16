import { plainToInstance } from 'class-transformer';
import { IsEnum, IsNumber, IsString, validateSync, IsOptional, IsBoolean } from 'class-validator';

/**
 * Возможные окружения
 */
enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
  Staging = 'staging',
}

/**
 * Класс для валидации переменных окружения
 * Это гарантирует type-safety и правильную конфигурацию при старте приложения
 */
class EnvironmentVariables {
  @IsEnum(Environment)
  @IsOptional()
  NODE_ENV: Environment = Environment.Development;

  @IsNumber()
  @IsOptional()
  PORT: number = 3000;

  // Database
  @IsString()
  @IsOptional()
  DB_HOST: string = 'localhost';

  @IsNumber()
  @IsOptional()
  DB_PORT: number = 5432;

  @IsString()
  @IsOptional()
  DB_USERNAME: string = 'postgres';

  @IsString()
  @IsOptional()
  DB_PASSWORD: string = 'postgres';

  @IsString()
  @IsOptional()
  DB_DATABASE: string = 'nestjs_db';

  @IsBoolean()
  @IsOptional()
  DB_SYNCHRONIZE: boolean = false;

  // JWT
  @IsString()
  JWT_SECRET: string;

  @IsString()
  @IsOptional()
  JWT_ACCESS_EXPIRATION: string = '15m';

  @IsString()
  @IsOptional()
  JWT_REFRESH_EXPIRATION: string = '7d';

  // Redis (опционально)
  @IsString()
  @IsOptional()
  REDIS_HOST: string = 'localhost';

  @IsNumber()
  @IsOptional()
  REDIS_PORT: number = 6379;

  @IsString()
  @IsOptional()
  REDIS_PASSWORD?: string;

  // Rate Limiting
  @IsNumber()
  @IsOptional()
  RATE_LIMIT_TTL: number = 60000;

  @IsNumber()
  @IsOptional()
  RATE_LIMIT_MAX: number = 100;
}

/**
 * Валидирует переменные окружения при старте приложения
 * Если что-то не так - приложение не запустится с понятной ошибкой
 */
export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(
      `❌ Ошибка валидации конфигурации:\n${errors.map(e => Object.values(e.constraints || {}).join(', ')).join('\n')}`
    );
  }

  return validatedConfig;
}

