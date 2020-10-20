require("dotenv").config();
const jwt = require("jsonwebtoken");

const authenticateJwt = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1];
    console.log(token);
    try {
      const decoded = jwt.verify(token, process.env.jwtPrivateKey);
      req.user = decoded;
      next();
    } catch (err) {
      res.status(403);
    }
  } else {
    res.status(401);
  }
};

module.exports = authenticateJwt;
