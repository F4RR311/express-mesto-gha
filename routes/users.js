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

const {
  userAvatarValid,
  parameterIdValid,
  userValid,
} = require('../middlewares/validationJoi');


router.get('/', auth, getUser);
router.get('/me', auth, getUserMe);
router.get('/:userId', auth, parameterIdValid('userId'), getUserId);
router.post('/', createUser);
router.patch('/me', auth, userValid, updateUserInfo);
router.patch('/me/avatar', auth, userAvatarValid, updateAvatar);

module.exports = router;
