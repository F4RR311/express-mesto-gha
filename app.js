require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const {errors} = require('celebrate');
const routerErrorWay = require('./routes/errorsway');
const {registerValid, loginValid} = require('./middlewares/validation');
const {requestLogger, errorLogger} = require('./middlewares/logger');
const {createUser, login} = require('./controllers/users');
const auth = require('./middlewares/auth');
const errorHandler = require('./middlewares/errorHandler');

const cors = require('cors');

// Слушаем 3000 порт
const {PORT = 3000} = process.env;
const app = express();
app.use(requestLogger);
app.use(bodyParser.json());
app.use(cors({
  origin: [
    'https://mestoproject.nomoredomains.xyz',
    'http://mestoproject.nomoredomains.xyz',
    'http://localhost:3000',
  ],
  methods: ['OPTIONS', 'GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  allowedHeaders: ['Content-Type', 'origin', 'Authorization'],
  credentials: true,
}));

app.use(bodyParser.urlencoded({extended: true}));

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});


app.post('/signup', registerValid, createUser);
app.post('/signin', loginValid, login);

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {useNewUrlParser: true});

app.use(errorLogger);

app.use(auth);

app.use(routerErrorWay);

app.use(errors());

app.use(errorHandler);

app.use(routerErrorWay);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
