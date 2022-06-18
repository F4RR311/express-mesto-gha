const mongoose = require('mongoose');
const User = require('./user');

const cardSchema = new mongoose.Schema({
  name: {
    required: true,
    type: String,
    minlength: 2,
    maxlength: 30,

  },
  link: {
    required: true,
    type: String,

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
