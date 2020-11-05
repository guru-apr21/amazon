const jwt = require("jsonwebtoken");
const { jwtPrivateKey } = require("../utils/config");
const User = require("../models/User");

const authenticateJwt = async (req, res, next) => {
  if (req.headers["x-access-token"]) {
    const accessToken = req.headers["x-access-token"];
    try {
      const { exp, userId } = jwt.verify(accessToken, jwtPrivateKey);
      if (exp < Date.now().valueOf() / 1000)
        return res.status(401).json({
          error: "JWT token has expired, please login to obtain a new one!",
        });
      res.locals.loggedInUser = await User.findById(userId);
      next();
    } catch (err) {
      console.log(err);
      res.status(403).end();
    }
  } else {
    next();
  }
};

const allowIfLoggedIn = async (req, res, next) => {
  try {
    const user = res.locals.loggedInUser;
    if (!user)
      return res
        .status(401)
        .json({ error: "You need to be logged in to access this route" });
    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = { allowIfLoggedIn, authenticateJwt };
