const mongoose = require('mongoose');

// Схема пользователя (описание структуры документов в коллекции)
const userSchema = new mongoose.Schema({
  id: {
    type: Number,
    unique: true,
  },
  first_name: {
    type: String,
    required: [true, 'Имя обязательно'],
    trim: true,
    minlength: [1, 'Имя не может быть пустым'],
    maxlength: [100, 'Имя не длиннее 100 символов'],
  },
  last_name: {
    type: String,
    required: [true, 'Фамилия обязательна'],
    trim: true,
    minlength: [1, 'Фамилия не может быть пустой'],
    maxlength: [100, 'Фамилия не длиннее 100 символов'],
  },
  age: {
    type: Number,
    required: [true, 'Возраст обязателен'],
    min: [0, 'Возраст не может быть отрицательным'],
    max: [150, 'Возраст не может быть больше 150'],
  },
  created_at: {
    type: Date,
    default: Date.now, // автоматически при создании
  },
  updated_at: {
    type: Date,
    default: Date.now, // будет обновляться при изменении
  },
}, {
  // Опции схемы
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Автоматическое обновление updated_at перед сохранением
userSchema.pre('findOneAndUpdate', function(next) {
  this.set({ updated_at: new Date() });
  next();
});

// Также для обычного update
userSchema.pre('updateOne', function(next) {
  this.set({ updated_at: new Date() });
  next();
});

// Автоматическая генерация числового ID (MongoDB использует _id по умолчанию)
userSchema.pre('save', async function(next) {
  if (this.isNew && !this.id) {
    const lastUser = await mongoose.model('User').findOne().sort({ id: -1 });
    this.id = lastUser ? lastUser.id + 1 : 1;
  }
  next();
});

// Создаём модель (коллекция в MongoDB называется 'users' во множественном числе)
const User = mongoose.model('User', userSchema);

module.exports = User;