const express = require('express');
const mongoose = require('mongoose');
const app = express();
const { PORT = 3000 } = process.env;


mongoose.connect('mongodb://localhost:27017/mestodb', { useNewUrlParser: true});



app.listen(PORT);