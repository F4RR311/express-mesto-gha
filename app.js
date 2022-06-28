const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const { validLogin, validUser } = require('./middlewares/validation');
const usersRoutes = require('./routes/users');
const cardsRoutes = require('./routes/cards');
const { createUser, login } = require('./controllers/users');
const auth = require('./middlewares/auth');
const errorHandler = require('./middlewares/errorHandler');
const ErrorNotFound = require('./errors/ErrorNotFound');

// Слушаем 3000 порт
const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(helmet());

app.post('/signin', validLogin, login);
app.post('/signup', validUser, createUser);
app.use('/users', auth, usersRoutes);
app.use('/cards', auth, cardsRoutes);

app.use('*', auth, () => {
  throw new ErrorNotFound('Запрашиваемая страница не найдена');
});

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', { useNewUrlParser: true });

app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
