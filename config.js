// config.js
const dotenv = require('dotenv');
dotenv.config();
module.exports = {
  port: process.env.PORT,
  endpoint: process.env.API_URL,
  accessKey: process.env.URA_ACCESS_KEY,
  clientID: process.env.MONGODB_CLIENT_ID,
  databaseName: process.env.MONGODB_DB_NAME,
  googleAuthClientID: process.env.GOOGLE_AUTH_CLIENT_ID,
  googleMapsKey: process.env.GOOGLE_MAPS_API_KEY,
  generalMapsKey: process.env.GOOGLE_MAPS_API_KEY_GENERAL,
};
