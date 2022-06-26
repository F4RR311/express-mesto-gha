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
  userValid,
  parameterIdValid
} = require('../middlewares/validationJoi');


router.get('/', getUser);
router.get('/me', getUserMe);
router.get('/:userId', parameterIdValid('id'), getUserId);
router.post('/', createUser);
router.patch('/me', auth, userValid, updateUserInfo);
router.patch('/me/avatar', auth, userAvatarValid, updateAvatar);

module.exports = router;
