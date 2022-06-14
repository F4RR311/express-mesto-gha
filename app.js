const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const routes = require('./routes/index');

// Слушаем 3000 порт
const { PORT = 3000} = process.env;

const app = express();



app.use(bodyParser.json());
app.use((req, res, next) => {
    req.user = {
        _id: '62a90c7d51e8680fbf057f48' // вставьте сюда _id созданного в предыдущем пункте пользователя
    };

    next();
});

app.use(routes);
mongoose.connect('mongodb://127.0.0.1:27017/mestodb',{useNewUrlParser: true,});

app.listen(PORT, ()=>{
    console.log(`App listening on port ${PORT}`);

});