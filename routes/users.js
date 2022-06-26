const router = require('express').Router();
const {
  getUser,
  getUserId,
  createUser,
  updateUserInfo,
  updateAvatar,
  getUserMe,
} = require('../controllers/users');

router.get('/', getUser);
router.get('/:userId', getUserId);
router.get('/me', getUserMe)
router.post('/', createUser);
router.patch('/me', updateUserInfo);
router.patch('/me/avatar', updateAvatar);

module.exports = router;
