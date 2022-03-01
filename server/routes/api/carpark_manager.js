const express = require('express');
const mongodb = require('mongodb');
const axios = require('axios');

const router = express.Router();

const URAAPI = require('./ura_api.js');

// GET: All Carpark Details
router.get('/cpd', async (req, res) => {
  const carpark_details = await connectDB('carpark_details');
  res.send(await carpark_details.find({}).toArray());
  res.status(200).send();
});

// GET: Specific Carpark Details
router.get('/cpd/:carparkNo', async (req, res) => {
  const carpark_details = await connectDB('carpark_details');
  res.send(await carpark_details.find({ ppCode: req.params.carparkNo }).toArray());
  res.status(200).send();
});

// GET: All Carpark Availability
router.get('/cpa', async (req, res) => {
  const carpark_availability = await connectDB('carpark_availability');
  res.send(await carpark_availability.find({}).toArray());
  res.status(200).send();
});

// GET: Specific Carpark Availability
router.get('/cpa/:carparkNo', async (req, res) => {
  const carpark_availability = await connectDB('carpark_availability');
  res.send(await carpark_availability.find({ carpark_number: req.params.carparkNo }).toArray());
  res.status(200).send();
});

// To update our DB daily (Carpark Details)
async function updateCarparkDetails() {
  // To generate the daily token
  //   await URAAPI.getToken();
  await URAAPI.getDetails().then(async (res) => {
    if (res.status == 200) {
      const carpark_details = await connectDB('carpark_details');
      await carpark_details.deleteMany({});
      await carpark_details.insertMany(res.data.Result);
      console.log('Carpark Details Updated to DB');
    }
  });
}

// To update our DB every 3 mins
async function updateCarparkAvailability() {
  // To generate the daily token
  //   await URAAPI.getToken();
  await URAAPI.getAvailability().then(async (res) => {
    if (res.status == 200) {
      const carpark_availability = await connectDB('carpark_availability');
      await carpark_availability.deleteMany({});
      await carpark_availability.insertMany(res.data.items[0].carpark_data);
      console.log('Carpark Availability Updated to DB');
    }
  });
}

// To connect to MongoDB
async function connectDB(collection) {
  // replace this
  const client = await mongodb.MongoClient.connect(
    'mongodb+srv://max:fizjic-jihwy4-Momqez@cluster0.zpk7p.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
    {
      useNewUrlParser: true,
    }
  );
  // Database name here
  return client.db('Cluster0').collection(collection);
}

module.exports = router;
