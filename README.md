# 🦸‍♂️ Superhero CRUD App

> Full-stack застосунок для керування базою супергероїв з підтримкою завантаження зображень, пошуку та редагування.

[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg?style=flat-square)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/database-MongoDB-green.svg?style=flat-square)](https://mongodb.com/)
[![React](https://img.shields.io/badge/frontend-React%2BTypeScript-blue.svg?style=flat-square)](https://reactjs.org/)

## ✨ Особливості

- 🎯 **CRUD операції** - Повний набір операцій для керування супергероями
- 🖼️ **Завантаження зображень** - Підтримка до 5 фото на героя (JPG/PNG)
- 🧪 **Покриття тестами** - Jest тести для надійності
- ⚡ **TypeScript** - Типобезпека та краща розробка

## 🛠️ Технологічний стек

### Backend
- **Node.js + Express** - REST API сервер
- **MongoDB + Mongoose** - NoSQL база даних
- **Multer** - Обробка завантаження файлів
- **Cloudinary** - Хмарне зберігання зображень (опціонально)
- **Jest** - Фреймворк для тестування
- **TypeScript** - Типізована JavaScript

### Frontend
- **React 18** - Сучасна бібліотека UI
- **TypeScript** - Статична типізація
- **Vite** - Швидка збірка та dev-сервер
- **React Router DOM** - Маршрутизація


## 📁 Структура проєкту

```
superhero-crud-app/
├── 📂 client/          # Frontend: React + TS + Vite
│   ├── 📂 src/
│   │   ├── 📂 components/
│   │   ├── 📂 pages/
│   │   ├── 📂 services/
│   │ 
│   └── 📄 package.json
├── 📂 server/          # Backend: Express + MongoDB
│   ├── 📂 src/
│   │   ├── 📂 controllers/
│   │   ├── 📂 models/
│   │   ├── 📂 routes/
│   │   └── 📂 middleware/
│   └── 📄 package.json
└── 📄 README.md
```

## 🚀 Швидкий старт

### 1. Клонування репозиторію

```bash
git clone https://github.com/ketalias/superhero-crud-app.git
cd superhero-crud-app
```

### 2. Налаштування Backend

```bash
cd server
npm install
```

Створіть файл `.env` в папці `server/`:

```env
# Основні налаштування
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/api/superheroes
BASE_URL=http://localhost:5000

# Cloudinary (опціонально для хмарного зберігання)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Запуск сервера:

```bash
# Режим розробки
npm run dev

# Збірка production
npm run build

# Запуск production
npm start
```

### 3. Налаштування Frontend

```bash
cd ../client
npm install
```

Створіть файл `.env` в папці `client/`:

```env
VITE_API_BASE_URL=http://localhost:5000
```

Запуск клієнта:

```bash
npm run dev
```

Застосунок буде доступний за адресою: `http://localhost:5173`

## 📡 API Документація

### Superheroes

| Метод | Endpoint | Опис |
|-------|----------|------|
| `GET` | `/superheroes?page=1` | Отримати список героїв з пагінацією |
| `GET` | `/superheroes/:id` | Отримати деталі конкретного героя |
| `POST` | `/superheroes` | Створити нового героя (з картинками) |
| `PUT` | `/superheroes/:id` | Оновити існуючого героя |
| `DELETE` | `/superheroes/:id` | Видалити героя |
| `DELETE` | `/superheroes/:id/image/:publicId` | Видалити окрему картинку |


### Приклад створення героя

```javascript
POST /superheroes
Content-Type: multipart/form-data

{
  "nickname": "Spider-Man",
  "real_name": "Peter Parker",
  "origin_description": "Bitten by a radioactive spider...",
  "superpowers": "Web-slinging, Wall-crawling, Spider-sense",
  "catch_phrase": "With great power comes great responsibility",
  "images": [File, File, File] // до 5 файлів
}
```

## 💻 Можливості інтерфейсу

- 📋 **Список героїв** - Перегляд всіх героїв з мініатюрами
- 👁️ **Детальний перегляд** - Повна інформація про героя з галереєю
- ✏️ **Редагування** - Зміна інформації та зображень
- ➕ **Створення** - Додавання нових героїв
- 🗑️ **Видалення** - Видалення героїв та окремих зображень
- 📄 **Пагінація** - Зручна навігація по великим спискам

## 🧪 Тестування

```bash
# Запуск тестів backend
cd server
npm test

# Запуск тестів з покриттям
npm run test:coverage

# Запуск тестів у watch режимі
npm run test:watch
```

## 🔧 Розробка

### Налаштування середовища розробки

1. Встановіть MongoDB локально або використовуйте MongoDB Atlas
2. Налаштуйте Cloudinary аккаунт (опціонально)
3. Встановіть Node.js версії 18 або вище
4. Встановіть залежності для обох частин проєкту



## 🤝 Контрибуція

1. Форкніть проєкт
2. Створіть feature гілку (`git checkout -b feature/AmazingFeature`)
3. Закомітьте зміни (`git commit -m 'Add some AmazingFeature'`)
4. Запуште в гілку (`git push origin feature/AmazingFeature`)
5. Відкрийте Pull Request


## 👨‍💻 Автор

**Roman Kovach**

- 🌐 Website: [https://github.com/ketalias](https://github.com/ketalias)

<div align="center">
  
**⭐ Поставте зірочку, якщо проєкт був корисним! ⭐**

Made with ❤️ in Ukraine 🇺🇦

</div>
