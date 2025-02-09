# 1. Используем официальный Node-образ
FROM node:18-alpine

# 2. Устанавливаем рабочую директорию внутри контейнера
WORKDIR /app

# 3. Копируем package*.json и устанавливаем зависимости
COPY package*.json ./
RUN npm install

# 4. Копируем всё остальное
COPY . .

# 5. Собираем TypeScript
RUN npm run build

# 6. Запуск приложения
CMD ["npm", "run", "start"]
