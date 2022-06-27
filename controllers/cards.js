const Card = require('../models/card');
const ErrorNotFound = require('../errors/ErrorNotFound');
const BadRequestError = require('../errors/BadRequestError');
const Forbidden = require('../errors/Forbidden');

module.exports.getCard = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({data: cards}))
    .catch((err) => next(err));
};

module.exports.createCard = (req, res, next) => {
  const {name, link} = req.body;
  const ownerId = req.user._id;
  Card.create({name, link, ownerId})
    .then((card) => res.status(201).send({data: card}))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
}

module.exports.deleteCard = (req, res, next) => {
  const {cardId} = req.params;
  const userId = req.user._id;

  Card.findById(cardId)
    .orFail(() => {
      throw new ErrorNotFound(`Запрашиваемая карточка не найдена`);
    })
    .then((card) => {
      if (card.owner.toString() !== userId) {
        throw new Forbidden('Отказано в удалении. Пользователь не является владельцем карточки');
      } else {
        return Card.findByIdAndRemove(cardId)
          .then((cardData) => {
            res.send({cardData});
          });
      }
    })

    .catch(next);
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardid,
    {$addToSet: {likes: req.user._id}},
    {new: true}
  )
    .then((card) => {
      if(!card){
        throw new  ErrorNotFound('Запрашиваемая карточка не найдена');
      }
      res.send({ data: card });
    })
    .catch(next);

};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardid,
    {$pull: {likes: req.user._id}},
    {new: true}
  )
    .then((card) => {
      if (!card) {
        throw new ErrorNotFound('Запрашиваемая карточка не найдена');
      }
      res.send({ data: card });
    })
    .catch(next);
};

