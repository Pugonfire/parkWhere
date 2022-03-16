const mongodb = require('mongodb');

class DatabaseAPI {
  static #clientID =
    'mongodb+srv://max:fizjic-jihwy4-Momqez@cluster0.zpk7p.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';

  static #databaseName = 'Cluster0';
  static #database = null; // singleton database instance

  // To connect to MongoDB
  static async connectDB() {
    // replace this
    const client = await mongodb.MongoClient.connect(this.#clientID, {
      useNewUrlParser: true,
    });
    // Database name here
    this.#database = client.db(this.#databaseName);
    console.log('MongoDB database is connected');
    // return client.db('Cluster0').collection(collection);
  }

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
