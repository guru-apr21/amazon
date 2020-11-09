const { Address, validateAddress } = require('../models/Address');

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
    const { error } = validateAddress(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { city, country, line1, line2, postalCode, state } = req.body;
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
  } catch (err) {
    next(err);
  }
};

/**
 *
 * @param {String} req.params.id
 * @param {Object} req.body Object with fields to be updated
 * @param {*} res
 * @param {*} next
 *
 * @returns 404 if address with the given id is not found.
 * @returns 200 if address updated successfully
 * Updates the address document with provided fields and returns the updated document
 */
const updateAddress = async (req, res, next) => {
  try {
    const { id } = req.params;
    let address = await Address.findOne({ _id: id, user: req.user._id });
    if (!address) {
      return res.status(404).json({ error: 'No address with the given id' });
    }
    address = await Address.findByIdAndUpdate(id, req.body, { new: true });
    res.json({ data: address, message: 'Address updated successfully!' });
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

module.exports = {
  getUserAddresses,
  createNewAddress,
  deleteAddressById,
  updateAddress,
};
