const router = require('express').Router();

const {
  getCard,
  createCard,
  likeCard,
  dislikeCard,
  deleteCard,
} = require('../controllers/cards');

const {
  validCardId, validCard
} = require('../middlewares/validation');

router.get('/', getCard);
router.post('/', validCard, createCard);
router.delete('/:cardId', validCardId, deleteCard);
router.put('/:cardId/likes', validCardId, likeCard);
router.delete('/:cardId/likes', validCardId, dislikeCard);

module.exports = router;
