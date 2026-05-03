const { Sequelize } = require('sequelize');

// Подключаемся к стандартной БД postgres (всегда существует)
const sequelizeAdmin = new Sequelize('postgres', 'postgres', '1234', {
  host: 'localhost',
  dialect: 'postgres',
  logging: false,
});

async function createDatabase() {
  try {
    console.log('🔧 Проверка и создание базы данных...');
    
    // Создаём базу, если её нет
    await sequelizeAdmin.query('CREATE DATABASE mydatabase;').catch(err => {
      if (err.message.includes('already exists')) {
        console.log('✅ БД "mydatabase" уже существует');
      } else {
        throw err;
      }
    });

    console.log('✅ БД "mydatabase" готова к использованию');
    await sequelizeAdmin.close();
  } catch (error) {
    console.error('❌ Ошибка при создании БД:', error.message);
    process.exit(1);
  }
}

createDatabase();
