const jwt = require('jsonwebtoken');
const { jwtPrivateKey } = require('../utils/config');
const User = require('../models/User');

const authenticateJwt = async (req, res, next) => {
  if (req.headers['x-access-token']) {
    const accessToken = req.headers['x-access-token'];
    try {
      const { userId } = jwt.verify(accessToken, jwtPrivateKey);
      res.locals.loggedInUser = await User.findById(userId);
      next();
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return res
          .status(400)
          .json({ error: 'Token expired login to continue' });
      }
      next();
    }
  } else {
    next();
  }
};

const allowIfLoggedIn = async (req, res, next) => {
  try {
    const user = res.locals.loggedInUser;
    if (!user) {
      return res
        .status(401)
        .json({ error: 'You need to be logged in to access this route' });
    }
    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = { allowIfLoggedIn, authenticateJwt };
