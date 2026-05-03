# 🚀 Запуск Swagger для 20practica (MongoDB версия)

## 📋 Что было добавлено

✅ swagger.js - конфиг для Swagger UI
✅ Обновлен server.js с интеграцией Swagger и JSDoc комментариями
✅ Обновлен package.json с нужными пакетами

## 📦 Установка зависимостей

```bash
cd "c:\Users\artza\OneDrive\Рабочий стол\фуллстек\kr4\20practica"
npm install
```

## 🔧 Проверка MongoDB подключения

Откройте `server.js` и проверьте строку 14:

```javascript
const MONGODB_URI = 'mongodb+srv://YourMongoAdmin:1234@cluster0.abcde.mongodb.net/userdb';
```

⚠️ **Вам нужно обновить:**
- `YourMongoAdmin` на ваше имя пользователя MongoDB
- `1234` на ваш пароль
- `cluster0.abcde.mongodb.net` на ваш кластер
- `userdb` на название вашей БД

Или если MongoDB локальная:

```javascript
const MONGODB_URI = 'mongodb://localhost:27017/userdb';
```

## ▶️ Запуск сервера

**Обычный запуск:**
```bash
npm start
```

**С автоперезагрузкой при изменениях:**
```bash
npm run dev
```

После запуска должны увидеть:
```
✅ Подключено к MongoDB
📁 База данных: userdb
🚀 Сервер запущен на http://localhost:3000
```

## 📚 Открыть Swagger документацию

Откройте в браузере:

```
http://localhost:3000/api-docs
```

## 🎯 Доступные endpoints в Swagger

✅ **Users (5 endpoints):**
- POST /api/users - создание пользователя
- GET /api/users - получение всех пользователей
- GET /api/users/:id - получение по ID
- PATCH /api/users/:id - обновление пользователя
- DELETE /api/users/:id - удаление пользователя

✅ **Statistics (1 endpoint):**
- GET /api/users/stats/age - статистика по возрасту

## 💡 Примеры curl запросов

```bash
# Создание пользователя
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"first_name":"Иван","last_name":"Петров","age":30}'

# Получить всех пользователей
curl http://localhost:3000/api/users

# Получить пользователя по ID
curl http://localhost:3000/api/users/1

# Обновить пользователя
curl -X PATCH http://localhost:3000/api/users/1 \
  -H "Content-Type: application/json" \
  -d '{"age":31}'

# Удалить пользователя
curl -X DELETE http://localhost:3000/api/users/1

# Получить статистику
curl http://localhost:3000/api/users/stats/age
```

## ⚠️ Решение проблем

**Ошибка подключения к MongoDB:**
- Проверьте URI в server.js (строка 14)
- Убедитесь, что MongoDB запущена
- Проверьте пароль и имя пользователя

**Swagger не открывается:**
- Проверьте, запущен ли сервер
- Откройте http://localhost:3000 в браузере

**Ports 3000 уже занят:**
- Измените `const PORT = 3000;` на другой порт в server.js
- Тогда Swagger будет по адресу: `http://localhost:YOUR_PORT/api-docs`
