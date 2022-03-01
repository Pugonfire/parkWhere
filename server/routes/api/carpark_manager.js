const express = require('express');
const mongodb = require('mongodb');
const axios = require('axios');

const router = express.Router();

const URAAPI = require('./ura.js');

// Get all Carpark Details
router.get('/carpark-details', async (req, res) => {
  updateCarparkDetails();

  //   const carparks = await ura_api.loadCarparksCollection();
  //   res.send(await carparks.find({}).toArray());
});

async function updateCarparkDetails() {
  // To generate the daily token
  //   await URAAPI.getToken();

  URAAPI.getDetails().then(async (res) => {
    console.log(res);
    if (res.Status == 'Success') {
      const carparks = await loadCarparksCollection();
      await carparks.updateMany({}, res.Result, { upsert: true });
      console.log('Inserted to DB');
    }
  });
}

// need to get fresh token
router.get('/getInfo', async (req, res) => {
  console.log(token);
  let status = null;
  axios
    .get('https://www.ura.gov.sg/uraDataService/invokeUraDS?service=Car_Park_Details', {
      headers: {
        AccessKey: '3df68727-2825-4d0a-aee7-768b467a0815',
        Token: token,
      },
    })
    .then((response) => {
      console.log('Data received');
      status = response.data.Status;
      console.log(status);
      results = response.data.Result;
    })
    .catch((error) => {
      console.log(error);
    })
    .finally(async () => {
      if (status == 'Success') {
        console.log('Inserted to DB');
        const posts = await loadCarparksCollection();
        await posts.insertMany(results);
      }
    });
});

router.get('/getAvailability', async (req, res) => {
  axios
    .get('https://api.data.gov.sg/v1/transport/carpark-availability', {
      headers: {
        accept: 'application/json',
      },
    })
    .then((response) => {
      this.availability = response.data.items[0];
      // get most recent availability
    })
    .catch((error) => {
      console.log(error);
    });
});

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