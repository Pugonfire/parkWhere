const express = require('express');
const mongodb = require('mongodb');
const axios = require('axios');
const nodeCron = require('node-cron');

const router = express.Router();

const URAAPI = require('./ura_api.js');

// GET: All Carpark Details
router.get('/cpd', async (req, res) => {
  const carpark_details = await connectDB('carpark_details');
  res.status(200).send(await carpark_details.find({}).toArray());
});

// GET: Specific Carpark Details
router.get('/cpd/:carparkNo', async (req, res) => {
  const carpark_details = await connectDB('carpark_details');
  res.status(200).send(await carpark_details.find({ ppCode: req.params.carparkNo }).toArray());
});

// GET: All Carpark Availability
router.get('/cpa', async (req, res) => {
  const carpark_availability = await connectDB('carpark_availability');
  res.status(200).send(await carpark_availability.find({}).toArray());
});

// GET: Specific Carpark Availability
router.get('/cpa/:carparkNo', async (req, res) => {
  const carpark_availability = await connectDB('carpark_availability');
  res.status(200).send(await carpark_availability.find({ carpark_number: req.params.carparkNo }).toArray());
});

// CronJob: Carpark Details (run once a day at 0000H)
// nodeCron.schedule('0 0 * * *', updateCarparkDetails, { timezone: 'Singapore' });

// CronJob: Carpark Availability (run once a day at 0000H)
// nodeCron.schedule('*/3 * * * *', updateCarparkAvailability, { timezone: 'Singapore' });

// To update Carpark Details
async function updateCarparkDetails() {
  // To generate the daily token
  await URAAPI.getToken();
  let res = await URAAPI.getDetails();
  const carpark_details = await connectDB('carpark_details');

  if (res.data.Status != 'Success') {
    const delay = (ms) => new Promise((res) => setTimeout(res, ms));
    await delay(300000);
    res = await URAAPI.getDetails();
  }

  if (res.data.Status != 'Success') {
    console.log('Failed to retrieve Carpark Details');
    return;
  }

  let package = massageDetails(res.data.Result);
  await carpark_details.deleteMany({});
  await carpark_details.insertMany(package);
  console.log('Carpark Details Updated to DB');
}

function massageDetails(data) {
  let package = [];
  data.forEach((cp) => {
    if (cp.vehCat === 'Car') {
      package.push(cp);
    }
  });
  package = package.reduce((acc, item) => {
    if (!acc[item.ppCode]) {
      acc[item.ppCode] = {
        ppCode: item.ppCode,
        ppName: item.ppName,
        vehCat: item.vehCat,
        parkingSystem: item.parkingSystem,
        parkCapacity: item.parkCapacity,
        geometries: item.geometries,
        remarks: item.remarks,
        rates: [],
      };
    }
    let pricing = {
      startTime: item.startTime,
      endTime: item.endTime,
      weekdayMin: item.weekdayMin,
      weekdayRate: item.weekdayRate,
      satdayMin: item.satdayMin,
      satdayRate: item.satdayRate,
      sunPHMin: item.sunPHMin,
      sunPHRate: item.sunPHMin,
    };
    acc[item.ppCode].rates.push(pricing);
    return acc;
  }, {});
  package = Object.keys(package).map((key) => {
    return package[key];
  });
  return package;
}

// To update Carpark Availabilities
async function updateCarparkAvailability() {
  let res = await URAAPI.getAvailability();
  const carpark_details = await connectDB('carpark_details');
  let package = massageAvailability(res.data.Result);
  await carpark_details.bulkWrite(package);
  console.log('Carpark Availability Updated to DB');
}

function massageAvailability(data) {
  let package = [];
  data.forEach((cp) => {
    if (cp.lotType === 'C') {
      let operation = {
        updateOne: {
          filter: {
            ppCode: cp.carparkNo,
          },
          update: {
            $set: {
              lotsAvailable: cp.lotsAvailable,
              lotType: cp.lotType,
              updateTime: new Date(),
            },
          },
        },
      };
      package.push(operation);
    }
  });
  return package;
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
