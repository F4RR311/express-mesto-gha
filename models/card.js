const mongoose = require('mongoose');
const { isURL } = require('validator');
const User = require('./user');

const cardSchema = new mongoose.Schema({
  name: {
    required: true,
    type: String,
    minlength: 2,
    maxlength: 30,

  },
  link: {
    type: String,
    required: true,
    validate: {
      validator: (v) => isURL(v, { required_protocol: true }),
      message: "Поле 'link' не соответствует формату URL",
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: User,
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: User,
      default: [],
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('card', cardSchema);
