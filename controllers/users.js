const Users = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const ErrorNotFound = require('../errors/ErrorNotFound');
const ErrorConflict = require('../errors/ErrorConflict');
const BadRequestError = require('../errors/BadRequestError');
const Unauthorized = require('../errors/Unauthorized');

module.exports.getUser = (req, res, next) => {
  Users.find({})
    .then((users) => res.send({data: users}))
    .catch((err) => next(err));
}

module.exports.getUserMe = (req, res, next) => {
  Users.findById(req.user._id)
    .then((user) => {
      if (!user._id) {
        next(new ErrorNotFound('Пользователь не найден'));
      }
      res.send(user);
    }).catch((err) => {
    if (err.name === 'CastError') {
      next(new BadRequestError('Переданы некорректные данные.'));
    } else {
      next(err)
    }

  })


}
module.exports.getUserId = (req, res, next) => {
  Users.findById(req.params.userId)
    .orFail(() => new ErrorNotFound('Пользователь не найден'))
    .then((user) => {
      if (!user._id) {
        next(new ErrorNotFound('Пользователь не найден'));
      }
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные.'));
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
    password
  } = req.body;
  Users.findOne({email})
    .then((user) => {
      if (user) {
        next(new ErrorConflict(`Пользователь с таким email ${email} уже зарегистрирован`));
      }
      return bcrypt.hash(password, 10);
    })
    .then((hash) => Users.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => Users.findOne({_id: user._id})) // скрываем пароль
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные.'));
      } else if (err.code === 11000) {
        next(new ErrorConflict({message: err.errorMessage}));
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
      if (!user) {
        next(new BadRequestError('Переданы некорректные данные'));
      }
      res.send({data: user});
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные'));
      }
      next(err);
    });
};

module.exports.updateAvatar = (req, res, next) => {
  const {avatar} = req.body;
  Users.findByIdAndUpdate(req.user._id, {avatar}, {new: true, runValidators: true})
    .orFail(() => {
      throw new BadRequestError('Переданы некорректные данные');
    })
    .then((user) => {
      if (!user) {
        next(new BadRequestError('Переданы некорректные данные'));
      }
      res.send({data: user});
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные'));
      }
      next(err);
    });
};

module.exports.login = (req, res, next) => {
  const {email, password} = req.body;
  return Users.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({id: user._id}, 'secret-123', {expiresIn: '7d'});
      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
        sameSite: true,
      })
      res.send({message: 'Авторизация успешна', token});
    })
    .catch((err) => {
      if (err.message === 'IncorrectEmail') {
        next(new Unauthorized('Не правильный логин или пароль'));
      }
      next(err);
    });
};

