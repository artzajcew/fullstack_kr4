const express = require('express');
const sequelize = require('./config/database');
const User = require('./models/User');
const { swaggerUi, specs } = require('./swagger');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

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

    const user = await User.create({
      first_name,
      last_name,
      age,
    });

    res.status(201).json(user);
  } catch (error) {
    console.error(error);
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
    const users = await User.findAll({
      order: [['created_at', 'DESC']], // сортировка по дате создания (новые сверху)
    });
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// 3. GET /api/users/:id - получение конкретного пользователя
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
 *       404:
 *         description: Пользователь не найден
 *       500:
 *         description: Ошибка сервера
 */
app.get('/api/users/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

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
 *       404:
 *         description: Пользователь не найден
 *       500:
 *         description: Ошибка сервера
 */
app.patch('/api/users/:id', async (req, res) => {
  try {
    const { first_name, last_name, age } = req.body;
    
    // Находим пользователя
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    // Обновляем только переданные поля
    const updateData = {};
    if (first_name !== undefined) updateData.first_name = first_name;
    if (last_name !== undefined) updateData.last_name = last_name;
    if (age !== undefined) updateData.age = age;

    // Обновляем (updated_at обновится автоматически через хук beforeUpdate)
    await user.update(updateData);

    // Получаем обновлённого пользователя
    const updatedUser = await User.findByPk(req.params.id);
    
    res.json(updatedUser);
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
 *       404:
 *         description: Пользователь не найден
 *       500:
 *         description: Ошибка сервера
 */
app.delete('/api/users/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    await user.destroy();
    res.json({ message: 'Пользователь успешно удалён' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// ========== ЗАПУСК СЕРВЕРА ==========

const startServer = async () => {
  try {
    // Проверка подключения к БД
    await sequelize.authenticate();
    console.log('✅ Подключение к PostgreSQL установлено');

    // Синхронизация моделей с БД (создаёт таблицу, если её нет)
    await sequelize.sync({ alter: true }); // alter: true - обновляет схему без потери данных
    console.log('✅ Таблицы синхронизированы');

    // Запуск сервера
    app.listen(PORT, () => {
      console.log(`🚀 Сервер запущен на http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Ошибка при запуске:', error);
  }
};

startServer();