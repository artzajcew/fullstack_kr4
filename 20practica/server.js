const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const User = require('./models/User');
const { swaggerUi, specs } = require('./swagger');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// ========== ПОДКЛЮЧЕНИЕ К MONGODB ==========

const MONGODB_URI = 'mongodb+srv://admin:1234@cluster0.hrxyfnj.mongodb.net/userdb?appName=Cluster0&retryWrites=true&w=majority';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ Подключено к MongoDB');
  console.log(`📁 База данных: ${mongoose.connection.name}`);
})
.catch((err) => {
  console.error('❌ Ошибка подключения к MongoDB:', err.message);
  process.exit(1);
});

// Обработка закрытия соединения
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('🔌 Соединение с MongoDB закрыто');
  process.exit(0);
});

// ========== CRUD ЭНДПОИНТЫ ==========

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Создание нового пользователя
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - first_name
 *               - last_name
 *               - age
 *             properties:
 *               first_name:
 *                 type: string
 *                 example: Иван
 *               last_name:
 *                 type: string
 *                 example: Петров
 *               age:
 *                 type: integer
 *                 example: 30
 *     responses:
 *       201:
 *         description: Пользователь успешно создан
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 id:
 *                   type: integer
 *                 first_name:
 *                   type: string
 *                 last_name:
 *                   type: string
 *                 age:
 *                   type: integer
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *                 updated_at:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Ошибка валидации - отсутствуют обязательные поля
 *       500:
 *         description: Ошибка сервера
 */
// 1. POST /api/users - создание пользователя
app.post('/api/users', async (req, res) => {
  try {
    const { first_name, last_name, age } = req.body;

    // Валидация обязательных полей
    if (!first_name || !last_name || age === undefined) {
      return res.status(400).json({
        error: 'Обязательные поля: first_name, last_name, age',
      });
    }

    // Создаём нового пользователя
    const user = new User({
      first_name,
      last_name,
      age,
    });

    await user.save();

    res.status(201).json(user);
  } catch (error) {
    console.error(error);
    
    // Обработка ошибки уникальности (хотя id генерируется автоматически)
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Дубликат ключа' });
    }
    
    res.status(500).json({ error: error.message });
  }
});

// 2. GET /api/users - получение всех пользователей
/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Получение всех пользователей
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Список всех пользователей
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   id:
 *                     type: integer
 *                   first_name:
 *                     type: string
 *                   last_name:
 *                     type: string
 *                   age:
 *                     type: integer
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *                   updated_at:
 *                     type: string
 *                     format: date-time
 *       500:
 *         description: Ошибка сервера
 */
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find().sort({ created_at: -1 }); // новые сверху
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// 3. GET /api/users/:id - получение конкретного пользователя (по нашему числовому id, не _id)
/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Получение пользователя по ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID пользователя
 *     responses:
 *       200:
 *         description: Данные пользователя
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 id:
 *                   type: integer
 *                 first_name:
 *                   type: string
 *                 last_name:
 *                   type: string
 *                 age:
 *                   type: integer
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *                 updated_at:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: ID должен быть числом
 *       404:
 *         description: Пользователь не найден
 *       500:
 *         description: Ошибка сервера
 */
app.get('/api/users/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({ error: 'ID должен быть числом' });
    }
    
    const user = await User.findOne({ id: id });
    
    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }
    
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// 4. PATCH /api/users/:id - обновление пользователя
/**
 * @swagger
 * /api/users/{id}:
 *   patch:
 *     summary: Обновление данных пользователя
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID пользователя
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               first_name:
 *                 type: string
 *                 example: Иван
 *               last_name:
 *                 type: string
 *                 example: Петров
 *               age:
 *                 type: integer
 *                 example: 30
 *     responses:
 *       200:
 *         description: Пользователь успешно обновлен
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 id:
 *                   type: integer
 *                 first_name:
 *                   type: string
 *                 last_name:
 *                   type: string
 *                 age:
 *                   type: integer
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *                 updated_at:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: ID должен быть числом
 *       404:
 *         description: Пользователь не найден
 *       500:
 *         description: Ошибка сервера
 */
app.patch('/api/users/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({ error: 'ID должен быть числом' });
    }
    
    const { first_name, last_name, age } = req.body;
    
    // Формируем объект с обновляемыми полями
    const updateData = {};
    if (first_name !== undefined) updateData.first_name = first_name;
    if (last_name !== undefined) updateData.last_name = last_name;
    if (age !== undefined) updateData.age = age;
    
    // Добавляем ручное обновление updated_at
    updateData.updated_at = new Date();
    
    const user = await User.findOneAndUpdate(
      { id: id },
      updateData,
      { new: true, runValidators: true } // new: true - возвращаем обновлённый документ
    );
    
    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }
    
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// 5. DELETE /api/users/:id - удаление пользователя
/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Удаление пользователя
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID пользователя
 *     responses:
 *       200:
 *         description: Пользователь успешно удален
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Пользователь успешно удалён
 *                 deleted_user:
 *                   type: object
 *       400:
 *         description: ID должен быть числом
 *       404:
 *         description: Пользователь не найден
 *       500:
 *         description: Ошибка сервера
 */
app.delete('/api/users/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({ error: 'ID должен быть числом' });
    }
    
    const user = await User.findOneAndDelete({ id: id });
    
    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }
    
    res.json({ 
      message: 'Пользователь успешно удалён',
      deleted_user: user 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// ========== ДОПОЛНИТЕЛЬНЫЙ ЭНДПОИНТ ==========
// GET /api/users/stats/age - статистика по возрасту
/**
 * @swagger
 * /api/users/stats/age:
 *   get:
 *     summary: Получение статистики по возрасту пользователей
 *     tags: [Statistics]
 *     responses:
 *       200:
 *         description: Статистика по возрасту
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 averageAge:
 *                   type: number
 *                   example: 28.5
 *                 minAge:
 *                   type: integer
 *                   example: 18
 *                 maxAge:
 *                   type: integer
 *                   example: 65
 *                 count:
 *                   type: integer
 *                   example: 10
 *       500:
 *         description: Ошибка сервера
 */
app.get('/api/users/stats/age', async (req, res) => {
  try {
    const stats = await User.aggregate([
      {
        $group: {
          _id: null,
          averageAge: { $avg: '$age' },
          minAge: { $min: '$age' },
          maxAge: { $max: '$age' },
          count: { $sum: 1 }
        }
      }
    ]);
    
    res.json(stats[0] || { averageAge: 0, minAge: 0, maxAge: 0, count: 0 });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// ========== ЗАПУСК СЕРВЕРА ==========
app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на http://localhost:${PORT}`);
  console.log(`📋 Доступные эндпоинты:`);
  console.log(`   POST   /api/users`);
  console.log(`   GET    /api/users`);
  console.log(`   GET    /api/users/:id`);
  console.log(`   PATCH  /api/users/:id`);
  console.log(`   DELETE /api/users/:id`);
  console.log(`   GET    /api/users/stats/age`);
});