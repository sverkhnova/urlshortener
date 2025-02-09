# URL Shortener

Простое приложение для сокращения ссылок с поддержкой Docker и PostgreSQL.

## Развертывание проекта:

1. Склонировать репозиторий.

2. Создать .env файл в корне, вписать переменные окружения из .env.example.

3. В корневой папке выполнить:

   ```bash
   docker-compose up --build
   ```

4. API доступен по адресу: http://localhost:3000.

## Эндпоинты API:

   1. Создание короткой ссылки:

   ```bash
   POST /shorten
   ```
   Тело запроса:
   ```
   {
    "originalUrl": "https://example.com",
    "alias"?: , 
   }
   ```

   2. Переход по короткой ссылке:

   ```bash
   GET /:alias
   ```

   3. Информация о ссылке:

   ```bash
   GET /info/:alias
   ```

   4. Удаление короткой ссылки

   ```bash
   DELETE /delete/:alias
   ```

   5. Аналитика переходов

   ```bash
   GET /analytics/:alias
   ```
