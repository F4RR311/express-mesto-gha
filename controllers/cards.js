const Card = require('../models/card');
const ErrorNotFound = require('../errors/ErrorNotFound');
const BadRequestError = require('../errors/BadRequestError');

module.exports.getCard = (req, res, next) => {
  Card.find({})
    .populate('owner')
    .then((card) => res.send({data: card}))
    .catch((err) => next(err));
};

module.exports.createCard = (req, res, next) => {
  const {name, link} = req.body;
  const owner = req.user._id;
  Card.create({name, link, owner})
    .then((card) => {
      if (!card) {
        next(new BadRequestError('Переданы некорректные данные'));
      }
      res.send({data: card});
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError({message: err.errorMessage}));
      }
      next(err);
    });
}

module.exports.deleteCard = (req, res, next) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail(() => {
      throw new ErrorNotFound('Карточка не найдена');
    })
    .then((card) => {
      if (!card) {
        next(new ErrorNotFound('Карточка не найдена'));
      }
      res.send({data: card});
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError({message: 'Переданы некорректные данные'}));
      }
      next(err);
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    {$addToSet: {likes: {_id: req.user._id}}},
    {new: true},
  )
    .orFail(() => {
      throw new ErrorNotFound('Карточка не найдена');
    })
    .then((card) => {
      if (!card) {
        next(new ErrorNotFound('Карточка не найдена'));
      }
      res.send({data: card});
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError({message: 'Переданы некорректные данные'}));
      }
      next(err);
    });
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    {$addToSet: {likes: {_id: req.user._id}}}, // добавить _id в массив, если его там нет
    {new: true},
  )
    .orFail(() => {
      throw new ErrorNotFound('Карточка не найдена');
    })
    .then((card) => {
      if (!card) {
        next(new ErrorNotFound('Карточка не найдена'));
      }
      res.send({data: card});
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError({message: err.errorMessage}));
      }
      next(err);
    });
};
