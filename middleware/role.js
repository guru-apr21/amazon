const seller = (req, res, next) => {
  const { role } = req.user;
  if (role === 'buyer') {
    return res.status(403).json({ error: 'Access denied!' });
  }
  next();
};

const superAdmin = (req, res, next) => {
  const { role } = req.user;
  if (role === 'buyer' || role === 'seller') {
    return res.status(403).json({ error: 'Access denied!' });
  }
  next();
};

module.exports = { seller, superAdmin };
