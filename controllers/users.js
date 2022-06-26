const Users = require('../models/user');
const bcrypt = require('bcrypt');
const jws = require('jsonwebtoken');
const {BAD_REQ, NOT_FOUND, CAST_ERR} = require('../utils/constants');

module.exports.getUser = (req, res) => {
  Users.find({})
    .then((users) => res.send({data: users}))
    .catch(() => {
      res.status(CAST_ERR).send({message: 'Ошибка по умолчанию.'});
    });
};

module.exports.getUserMe = (req, res, next) => {
  Users.findById(req.user._id)
    .then(() => {
      if (!user._id) {
        next(NOT_FOUND('Пользователь не найден'));
      }
    return res.send(user);
    }).catch((err)=>{
      if(err.name === 'CastError'){
        next(BAD_REQ('Переданы некорректные данные.'))
      } else {
        next(err)
      }

  })


}
module.exports.getUserId = (req, res) => {
  Users.findById(req.params.userId)
    .orFail(() => new Error('Not Found'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        res.status(BAD_REQ).send({message: 'Переданы некорректные данные при запросе пользователя.'});
        return;
      }
      if (err.message === 'Not Found') {
        res.status(NOT_FOUND).send({message: 'Пользователь с указанным _id не найден.'});
        return;
      }
      res.status(CAST_ERR).send({message: 'Ошибка по умолчанию.'});
    });
};

module.exports.createUser = (req, res) => {
  const {name, about, avatar, email, password} = req.body;


  Users.findOne({email})
  Users.create({name, about, avatar})
    .then()
    .then((user) => res.send({data: user}))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        res.status(BAD_REQ).send({message: 'Переданы некорректные данные при создании пользователя.'});
        return;
      }
      res.status(CAST_ERR).send({message: 'Ошибка по умолчанию.'});
    });
};

module.exports.updateUserInfo = (req, res) => {
  const {name, about} = req.body;
  Users.findByIdAndUpdate(req.user._id, {name, about}, {new: true, runValidators: true})
    .orFail(() => new Error('Not Found'))
    .then((user) => res.send({data: user}))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        res.status(BAD_REQ).send({message: 'Переданы некорректные данные при обновлении профиля.'});
        return;
      }
      if (err.message === 'Not Found') {
        res.status(NOT_FOUND).send({message: 'Пользователь с указанным _id не найден.'});
        return;
      }
      res.status(CAST_ERR).send({message: 'Ошибка по умолчанию.'});
    });
};

module.exports.updateAvatar = (req, res) => {
  const {avatar} = req.body;
  Users.findByIdAndUpdate(req.user._id, {avatar}, {new: true, runValidators: true})
    .orFail(() => new Error('Not Found'))
    .then((user) => res.send({data: user}))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        res.status(BAD_REQ).send({message: 'Переданы некорректные данные при обновлении аватара.'});
        return;
      }
      if (err.message === 'Not Found') {
        res.status(NOT_FOUND).send({message: 'Пользователь с указанным _id не найден.'});
        return;
      }
      res.status(CAST_ERR).send({message: 'Ошибка по умолчанию.'});
    });
};
