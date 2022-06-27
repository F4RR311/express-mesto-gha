const router = require('express').Router();

const {
  getCard,
  createCard,
  likeCard,
  dislikeCard,
  deleteCard,
} = require('../controllers/cards');

const {
  createCardValid,
  parameterIdValid,
} = require('../middlewares/validation');

router.get('/', getCard);
router.post('/', createCardValid, createCard);
router.delete('/:cardId', parameterIdValid('cardId'), deleteCard);
router.put('/:cardId/likes', parameterIdValid('cardId'), likeCard);
router.delete('/:cardId/likes', parameterIdValid('cardId'), dislikeCard);
module.exports = router;
