require('dotenv').config();
const STRIPE_ACCESS_KEY = process.env.STRIPE_ACCESS_KEY;
const stripe = require('stripe')(STRIPE_ACCESS_KEY);

const PORT = process.env.PORT;
let MONGO_URL = process.env.MONGO_URL;
const jwtPrivateKey = process.env.jwtPrivateKey;
const SECRET_ACCESS_KEY = process.env.SECRET_ACCESS_KEY;
const ACCESS_KEY_ID = process.env.ACCESS_KEY_ID;
const CLOUD_FRONT_URL = process.env.CLOUD_FRONT_URL;
const REGION = process.env.REGION;
const BUCKET_NAME = process.env.BUCKET_NAME;

if (process.env.NODE_ENV === 'test') MONGO_URL = process.env.TEST_MONGO_URL;
module.exports = {
  PORT,
  MONGO_URL,
  jwtPrivateKey,
  SECRET_ACCESS_KEY,
  ACCESS_KEY_ID,
  CLOUD_FRONT_URL,
  REGION,
  BUCKET_NAME,
  stripe,
};
