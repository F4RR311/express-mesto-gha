const router = require('express').Router();

const {
  getUser,
  getUserId,
  updateUserInfo,
  updateAvatar,
  getUserMe,
} = require('../controllers/users');

const {
  validUserId,
  validAboutUser,
  validAvatar
} = require('../middlewares/validation');


router.get('/', getUser);
router.get('/me', validUserId, getUserMe);
router.get('/:userId', validUserId, getUserId);
router.patch('/me', validAboutUser, updateUserInfo);
router.patch('/me/avatar', validAvatar, updateAvatar);

module.exports = router;
