const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Users = require('../models/user');
const ErrorNotFound = require('../errors/ErrorNotFound');
const ErrorConflict = require('../errors/ErrorConflict');
const BadRequestError = require('../errors/BadRequestError');
const Unauthorized = require('../errors/Unauthorized');
const {NODE_ENV, JWT_SECRET} = process.env;

module.exports.getUser = (req, res, next) => {
  Users.find({})
    .then((users) => res.send(users))
    .catch(next);
};

module.exports.getUserMe = (req, res, next) => {
  Users.findById(req.user._id)
    .then((user) => {
      if (!user._id) {
        next(new ErrorNotFound('Пользователь не найден'));
      }
      res.send(user);
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const {email, password} = req.body;
  return Users.findUserByCredentials(res, email, password)
    .then((user) => {
      const token = jwt.sign(
        {_id: user._id},
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        {expiresIn: '7d'},
      );
      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
        sameSite: true,
      });
      res.send({message: 'Авторизация успешна', token});
    })
    .catch(() => {
      next(new Unauthorized('Не правильный логин или пароль'));
    });
};

module.exports.getUserId = (req, res, next) => {
  Users.findById(req.params.userId)
    .orFail(() => new ErrorNotFound('Пользователь не найден'))
    .then((users) => res.send(users))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ErrorBadRequest('Пользователь по указанному _id не найден.'));
      } else if (err.statusCode === 404) {
        next(new ErrorNotFound('Пользователь по указанному _id не найден.'));
      } else {
        next(err);
      }
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  User.findOne({email})
    .then((user) => {
      if (user) {
        next(new ErrorConflict('Пользователь с таким email уже зарегистрирован'));
      }
      return bcrypt.hash(password, 10);
    })
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => User.findOne({_id: user._id}))
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные.'));
      } else if (err.code === 11000) {
        next(new ErrorConflict('Пользователь уже существует'));
      } else {
        next(err);
      }
    });
};


module.exports.updateUserInfo = (req, res, next) => {
  const {name, about} = req.body;
  Users.findByIdAndUpdate(req.user._id, {name, about}, {new: true, runValidators: true})
    .orFail(() => {
      throw new BadRequestError('Переданы некорректные данные');
    })
    .then((user) => {
      res.send({data: user});
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создании пользователя.'));
      } else {
        next(err);
      }
    });
};

module.exports.updateAvatar = (req, res, next) => {
  const {avatar} = req.body;
  Users.findByIdAndUpdate(req.user._id, {avatar}, {new: true, runValidators: true})
    .then((user) => {
      res.send({data: user});
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создании пользователя.'));
      } else {
        next(err);
      }
    });
};

