/**
 * Class to create a static singleton connection with MongoDB database
 * @class DatabaseAPI
 * @requires mongodb
 */
const mongodb = require('mongodb');
const { clientID, databaseName } = require('../config');

class DatabaseAPI {
  static #clientID = clientID;

  static #databaseName = databaseName;
  static #database = null; // singleton database instance

  /**
   * To connect to database
   */
  static async connectDB() {
    // replace this
    const client = await mongodb.MongoClient.connect(this.#clientID, {
      useNewUrlParser: true,
    });
    // Database name here
    this.#database = client.db(this.#databaseName);
    console.log('MongoDB database is connected');
  }

  /**
   * To connect to collection in database
   */
  static connectCollection(collectionName) {
    try {
      console.log(collectionName, 'is connected');
      return this.#database.collection(collectionName);
    } catch (err) {
      if (!this.#database) {
        console.log('Database not connected yet');
        console.log('Reattempting connection');
        this.connectDB();
      }
      console.log(err);
    }
  }
}

module.exports = DatabaseAPI;
