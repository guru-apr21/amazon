module.exports = function (req, res, next) {
  const admin = req.user.admin;
  if (!admin) return res.status(403).json({ error: "Access denied" });
  next();
};
