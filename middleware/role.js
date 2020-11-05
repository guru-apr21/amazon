const seller = function (req, res, next) {
  const { role } = req.user;
  if (role === "buyer")
    return res.status(403).json({ error: "Access denied!" });
  next();
};

const superAdmin = function (req, res, next) {
  const { role } = req.user;
  if (role === "superAdmin")
    return res.status(403).json({ error: "Access denied!" });
  next();
};

module.exports = { seller, superAdmin };
