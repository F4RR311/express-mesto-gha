const usersRouter = require('express').Router();

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
  validAvatar,
} = require('../middlewares/validation');

usersRouter.get('/', getUser);
usersRouter.get('/me', validUserId, getUserMe);
usersRouter.get('/:userId', validUserId, getUserId);
usersRouter.patch('/me', validAboutUser, updateUserInfo);
usersRouter.patch('/me/avatar', validAvatar, updateAvatar);

module.exports = usersRouter;
