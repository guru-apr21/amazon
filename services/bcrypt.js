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
  return await bcrypt.compare(password, hash);
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
