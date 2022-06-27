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
    .then((users) => res.send({data: users}))
    .catch(next);
};

module.exports.getUserMe = (req, res, next) => {
  Users.findById(req.user._id)
    .then((user) => {
      if (!user._id) {
        next(new ErrorNotFound('Пользователь не найден'));
      }
      res.status(200).send(user);
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
      res.status(200).send({message: 'Авторизация успешна', token});
    })
    .catch(() => {
      next(new Unauthorized('Не правильный логин или пароль'));
    });
};

module.exports.getUserId = (req, res, next) => {
  Users.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        throw new ErrorNotFound('Запрашиваемый пользователь не найден');
      }
      res.send({data: user});
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => res.status(201).send({
      data: {
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        email: user.email,
      },
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные'));
      }
      if (err.code === 11000) {
        next(new ErrorConflict('Вы уже зарегистрированы, выполните вход'));
      } else {
        next(err);
      }
    });
};


module.exports.updateUserInfo = (req, res, next) => {
  const {name, about} = req.body;
  Users.findByIdAndUpdate(req.user._id,
    {name, about},
    {
      new: true, runValidators: true
    }
  )
    .then((user) => {
      if (!user) {
        throw new ErrorNotFound('Запрашиваемый пользователь не найден');
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные'));
      } else { next(err); }
    });
};

module.exports.updateAvatar = (req, res, next) => {
  const {avatar} = req.body;
  Users.findByIdAndUpdate(req.user._id,
    {avatar},
    {
      new: true, runValidators: true
    }
  )
    .then((user) => {
      res.status(200).send({data: user});
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создании пользователя.'));
      } else {
        next(err);
      }
    });
};

