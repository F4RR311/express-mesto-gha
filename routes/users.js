const router = require('express').Router();

const {
  getUser,
  getUserId,
  updateUserInfo,
  updateAvatar,
  getUserMe,
} = require('../controllers/users');

const {
  userAvatarValid,
  userValid,
  parameterIdValid
} = require('../middlewares/validation');


router.get('/', getUser);
router.get('/me', getUserMe);
router.get('/:id', parameterIdValid('id'), getUserId);
router.patch('/me', userValid, updateUserInfo);
router.patch('/me/avatar', userAvatarValid, updateAvatar);

module.exports = router;
