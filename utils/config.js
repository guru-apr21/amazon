require("dotenv").config();

const PORT = process.env.PORT;
let MONGO_URL = process.env.MONGO_URL;
const jwtPrivateKey = process.env.jwtPrivateKey;

if (process.env.NODE_ENV === "test") MONGO_URL = process.env.TEST_MONGO_URL;
module.exports = { PORT, MONGO_URL, jwtPrivateKey };
