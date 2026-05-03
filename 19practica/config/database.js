const { Sequelize } = require('sequelize');

// Для локального подключения
const sequelize = new Sequelize('mydatabase', 'postgres', '1234', {
  host: 'localhost',
  dialect: 'postgres',
  logging: false, // отключаем вывод SQL-запросов в консоль (опционально)
});

module.exports = sequelize;