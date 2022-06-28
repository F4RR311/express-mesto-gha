const Card = require('../models/card');
const ErrorNotFound = require('../errors/ErrorNotFound');
const BadRequestError = require('../errors/BadRequestError');
const Forbidden = require('../errors/Forbidden');

module.exports.getCard = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => next(err));
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.status(201).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

module.exports.deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  const userId = req.user._id;

  Card.findById(cardId)
    .orFail(() => {
      throw new ErrorNotFound('Запрашиваемая карточка не найдена');
    })
    .then((card) => {
      if (card.owner.toString() !== userId) {
        throw new Forbidden('Отказано в удалении. Пользователь не является владельцем карточки');
      } else {
        return Card.findByIdAndRemove(cardId)
          .then((cardData) => {
            res.send({ cardData });
          });
      }
    })

    .catch(next);
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .then((cardData) => {
      if (!cardData) {
        throw new ErrorNotFound('Запрашиваемая карточка не найдена');
      }
      res.send({ data: cardData });
    })
    .catch(next);
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .then((cardData) => {
      if (!cardData) {
        throw new ErrorNotFound('Запрашиваемая карточка не найдена');
      }
      res.send({ data: cardData });
    })
    .catch(next);
};
