const jwt = require('jsonwebtoken');
const Unauthorized = require('../errors/Unauthorized');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new Unauthorized('Необходима авторизация'));
  }
  const token = String(req.headers.authorization).replace('Bearer ', '');

  let payload;

  try {
    // пробуем верифицировать токен
    payload = jwt.verify(token, 'secret-123');
  } catch (err) {
    // отправим ошибку
    return next(new Unauthorized('Необходима авторизация'));
  }
  req.user = payload;
  return next();
};
