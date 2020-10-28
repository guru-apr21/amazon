const jwt = require("jsonwebtoken");
const { jwtPrivateKey } = require("../utils/config");
const authenticateJwt = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, jwtPrivateKey);
    req.user = decoded;
    next();
    return;
  } catch (err) {
    res.status(403);
  }
};

module.exports = authenticateJwt;
