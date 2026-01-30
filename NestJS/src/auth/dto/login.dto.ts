import {
  // Базовые
  IsOptional, IsDefined, IsNotEmpty, IsEnum, IsIn, IsNotIn,

  // Типы данных
  IsString, IsBoolean, IsNumber, IsInt, IsArray, IsObject,

  // Строки и форматы
  IsEmail, IsUrl, IsUUID, IsPhoneNumber, IsJSON, IsStrongPassword,
  MinLength, MaxLength, Length, Matches, Contains,

  // Числа
  Min, Max, IsPositive, IsNegative,

  // Даты
  IsDate, IsDateString, MinDate, MaxDate,

  // Вложенная валидация
  ValidateNested
} from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Пожалуйста, введите корректный email' })
  @IsNotEmpty({ message: 'Поле не должно быть пустым' })
  email: string;

  @IsString({ message: 'Пароль должен быть строкой' })
  @IsNotEmpty({ message: 'Пароль не должен быть пустым' })
  password: string;

  @IsOptional()
  @IsString({ message: 'Код двухфакторной аутентификации должен быть строкой' })
  twoFactorCode?: string;

  @IsOptional()
  @IsString({ message: 'Remember me должен быть строкой' })
  rememberMe?: string;
} 