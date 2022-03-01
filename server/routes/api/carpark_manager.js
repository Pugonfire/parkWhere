const express = require('express');
const mongodb = require('mongodb');
const axios = require('axios');

const router = express.Router();

const URAAPI = require('./ura.js');

// Get all Carpark Details
router.get('/carpark-details', async (req, res) => {
  await updateCarparkDetails();
  //   const carparks = await ura_api.loadCarparksCollection();
  //   res.send(await carparks.find({}).toArray());
});

async function updateCarparkDetails() {
  // To generate the daily token
  //   await URAAPI.getToken();
  await URAAPI.getDetails().then(async (res) => {
    console.log(res.data.Status);
    if (res.data.Status == 'Success') {
      const carparks = await loadCarparksCollection();
      await carparks.deleteMany({});
      await carparks.insertMany(res.data.Result);
      console.log('Inserted to DB');
    }
  });
}

async function loadCarparksCollection() {
  // replace this
  const client = await mongodb.MongoClient.connect(
    'mongodb+srv://max:fizjic-jihwy4-Momqez@cluster0.zpk7p.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
    {
      useNewUrlParser: true,
    }
  );

  // database name here
  return client.db('Cluster0').collection('carparks');
}

module.exports = router;
