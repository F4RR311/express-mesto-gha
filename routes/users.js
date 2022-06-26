const router = require('express').Router();
const auth = require('../middlewares/auth');

const {
  getUser,
  getUserId,
  createUser,
  updateUserInfo,
  updateAvatar,
  getUserMe,
} = require('../controllers/users');

router.get('/', getUser);
router.get('/me', getUserMe);
router.get('/:userId', getUserId);
router.post('/', createUser);
router.patch('/me', updateUserInfo);
router.patch('/me/avatar', updateAvatar);

module.exports = router;
