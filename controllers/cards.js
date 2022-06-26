const Card = require('../models/card');
const ErrorNotFound = require('../errors/ErrorNotFound');
//const BadRequestError = require('../errors/BadRequestError');

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
    .then((cards) => res.send(cards))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ErrorBadRequest(`${Object.values(err.errors).map((error) => error.message).join(', ')}`));
      } else {
        next(err);
      }
    });
}

module.exports.deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  const userId = req.user._id;

  Card.findById({ _id: cardId })
    .orFail(() => {
      throw new ErrorNotFound(`Карточка с id ${cardId} не найдена!`);
    })
    .then((card) => {
      if (card.owner.toString() !== userId) {
        throw new Forbidden('Отказано в удалении. Пользователь не является владельцом карточки');
      }
      return Card.findByIdAndRemove(card._id);
    })
    .then((card) => res.send({ message: 'Успешно удалена карточка:', data: card }))
    .catch(next);
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
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ErrorBadRequest('Переданы некорректные данные для постановки/снятии лайка.'));
      } else if (err.name === 'CastError') {
        next(new ErrorBadRequest('Передан несуществующий _id карточки.'));
      } else {
        next(err);
      }
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
      res.send({ data: card });
    })
    .catch((err) => {
    if (err.name === 'ValidationError') {
      next(new ErrorBadRequest('Переданы некорректные данные для постановки/снятии лайка.'));
    } else if (err.name === 'CastError') {
      next(new ErrorBadRequest('Передан несуществующий _id карточки.'));
    } else {
      next(err);
    }
  });
};
