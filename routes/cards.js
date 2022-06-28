const cardsRouter = require('express').Router();

const {
  getCard,
  createCard,
  likeCard,
  dislikeCard,
  deleteCard,
} = require('../controllers/cards');

const {
  validCardId, validCard,
} = require('../middlewares/validation');

cardsRouter.get('/', getCard);
cardsRouter.post('/', validCard, createCard);
cardsRouter.delete('/:cardId', validCardId, deleteCard);
cardsRouter.put('/:cardId/likes', validCardId, likeCard);
cardsRouter.delete('/:cardId/likes', validCardId, dislikeCard);

module.exports = cardsRouter;
