const bcrypt = require("bcrypt");

const comparePassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

const hashPassword = async (password) => {
  const hash = await bcrypt.hash(password, 10);
  return hash;
};
module.exports = { comparePassword, hashPassword };
