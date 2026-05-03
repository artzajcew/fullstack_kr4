# Swagger Setup для User API

## 📋 Что было добавлено

Я создал полную документацию Swagger для вашего API. Вот что сделано:

### 1. **swagger.js** - конфиг Swagger
Файл содержит конфигурацию swagger-jsdoc для автоматического генерирования документации из JSDoc комментариев в server.js

### 2. **Обновлен server.js**
- Добавлена интеграция Swagger UI
- Добавлены JSDoc комментарии для всех 5 endpoints:
  - ✅ POST /api/users - создание пользователя
  - ✅ GET /api/users - получение всех пользователей
  - ✅ GET /api/users/:id - получение пользователя по ID
  - ✅ PATCH /api/users/:id - обновление пользователя
  - ✅ DELETE /api/users/:id - удаление пользователя

### 3. **Обновлен package.json**
Добавлены зависимости:
```json
"swagger-jsdoc": "^6.2.8",
"swagger-ui-express": "^5.0.0"
```

## 🚀 Установка

Выполните в папке проекта (19practica):

```bash
npm install
```

## 📚 Использование

После установки и запуска сервера откройте в браузере:

```
http://localhost:3000/api-docs
```

Там вы сможете:
- 📖 Просмотреть документацию всех endpoints
- 🧪 Протестировать API прямо из браузера ("Try it out")
- 💾 Посмотреть примеры запросов и ответов
- ⚠️ Увидеть список возможных ошибок

## 📝 Примеры запросов

### Создание пользователя
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Иван",
    "last_name": "Петров",
    "age": 30
  }'
```

### Получение всех пользователей
```bash
curl http://localhost:3000/api/users
```

### Получение пользователя по ID
```bash
curl http://localhost:3000/api/users/1
```

### Обновление пользователя
```bash
curl -X PATCH http://localhost:3000/api/users/1 \
  -H "Content-Type: application/json" \
  -d '{
    "age": 31
  }'
```

### Удаление пользователя
```bash
curl -X DELETE http://localhost:3000/api/users/1
```

## 🎯 Структура Swagger

Документация включает:
- ✅ Описание каждого endpoint
- ✅ Параметры запроса и тела
- ✅ Примеры данных
- ✅ Коды ответов (200, 201, 400, 404, 500)
- ✅ Структура данных в responses
- ✅ Группировка под тегом "Users"
