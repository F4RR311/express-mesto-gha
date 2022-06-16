const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const users = require('./routes/users');
const cards = require('./routes/cards');

// Слушаем 3000 порт
const {PORT = 3000} = process.env;
const app = express();

const NOT_FOUND = 404;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {useNewUrlParser: true,});

app.use((req, res, next) => {
    req.user = {
        _id: '62a90c7d51e8680fbf057f48' // вставьте сюда _id созданного в предыдущем пункте пользователя
    };
    next();
});

app.use('/users', users);
app.use('/cards', cards);

app.use((req, res) => {
    res.status(NOT_FOUND).send({ message: 'Путь не найден' });
});

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);

});