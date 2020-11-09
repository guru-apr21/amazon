const mongoose = require('mongoose');
const joi = require('joi');

const addressSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, required: true },
  line1: { type: String, required: true },
  line2: { type: String, required: true },
  state: { type: String, required: true },
  city: { type: String, required: true },
  postalCode: { type: String, required: true },
  country: { type: String, required: true },
});

// eslint no-param-reassign: ["error", { "props": false }]
addressSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject._id = returnedObject._id.toString();
    delete returnedObject.__v;
  },
});

const validateAddress = (value) => {
  const schema = joi.object({
    line1: joi.string().required(),
    line2: joi.string().required(),
    state: joi.string().required(),
    city: joi.string().required(),
    postalCode: joi.string().required(),
    country: joi.string().required(),
  });
  return schema.validate(value);
};

const Address = mongoose.model('Address', addressSchema);
module.exports = { Address, validateAddress };
