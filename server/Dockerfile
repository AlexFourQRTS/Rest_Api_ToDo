# Базовый образ Node.js
FROM node:18

# Рабочая директория в контейнере
WORKDIR /server

# Копируем package.json и устанавливаем зависимости
COPY package.json package-lock.json* ./
RUN npm install

# Копируем код приложения
COPY . .

# Команда для запуска
CMD ["node", "Server.js"]