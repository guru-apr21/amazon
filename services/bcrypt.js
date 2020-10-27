const bcrypt = require("bcrypt");

/**
 *
 * @param {String} password
 * @param {Hash} hash
 *
 * @returns {Boolean}
 *
 */
const comparePassword = async (password, hash) => {
  const match = await bcrypt.compare(password, hash);
  return match;
};

/**
 *
 * @param {String} password
 *
 * @returns hash
 */
const hashPassword = async (password) => {
  const hash = await bcrypt.hash(password, 10);
  return hash;
};
module.exports = { comparePassword, hashPassword };
