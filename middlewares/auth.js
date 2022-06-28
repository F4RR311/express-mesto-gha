const jwt = require('jsonwebtoken');
const Unauthorized = require('../errors/Unauthorized');

const auth = (req, res, next) => {
  const token = req.cookies.jwt;
  let payload;

  try {
    payload = jwt.verify(token, 'secret-key');
  } catch (e) {
    throw new Unauthorized('Необходима авторизация');
  }
  req.user = payload;

  next();
};

module.exports = auth;
