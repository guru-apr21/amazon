const Address = require('../models/Address');

/**
 *
 * @param {ObjectId} req.user._id
 * @param {*} res
 * @param {*} next
 *
 * @returns {Array} Gets all available addresses on given userId
 */
const getUserAddresses = async (req, res, next) => {
  try {
    const addresses = await Address.find({ user: req.user._id });
    if (!addresses) {
      return res.status(404).json({ message: 'No address with the given id.' });
    }
    res.json(addresses);
  } catch (error) {
    next(error);
  }
};

/**
 *
 * @param {String} req.body.city
 * @param {String} req.body.country
 * @param {String} req.body.line1
 * @param {String} req.body.line2
 * @param {String} req.body.postal_code
 * @param {String} req.body.state
 * @param {*} res
 * @param {*} next
 *
 * @returns New address document saved in Mongodb
 */

const createNewAddress = async (req, res, next) => {
  try {
    const { city, country, line1 } = req.body;
    const { line2, postalCode, state } = req.body;
    let address = new Address({
      user: req.user._id,
      city,
      country,
      line1,
      line2,
      postalCode,
      state,
    });

    address = await address.save();
    return res.status(201).json(address);
  } catch (error) {
    next(error);
  }
};

/**
 *
 * @param {*} req.params.id
 * @param {*} res
 * @param {*} next
 *
 * @returns status 404 if no address with the given id
 * @returns status 204 no content if deleted successfully
 */
const deleteAddressById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const address = await Address.findById(id);
    if (!address) return res.status(404).json('No address with the given id');
    if (req.user.role !== 'superAdmin') {
      if (address.user !== req.user._id) {
        return res.status(401).json('Access denied');
      }
    }
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

module.exports = { getUserAddresses, createNewAddress, deleteAddressById };
