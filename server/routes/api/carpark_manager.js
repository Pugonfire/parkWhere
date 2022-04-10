/** Handles carpark entity
 * @module carpark_manager
 * @requires express
 * @requires database_api
 * @requires node-cron
 * @requires ura_api
 */
const express = require('express');
const database = require('../../database_api');
const nodeCron = require('node-cron');
const URAAPI = require('../../ura_api');

const router = express.Router();

/**
 * GET: All carpark details
 * @name /cpd
 * @function
 * @inner
 * @param {string} res - Response
 */
router.get('/cpd', async (req, res) => {
  const carpark_details = database.connectCollection('carpark_details');
  res.status(200).send(await carpark_details.find({}).toArray());
});

/**
 * GET: Specific carpark details
 * @name /cpd/:carparkNo
 * @function
 * @inner
 * @param {string} req - Request
 * @param {string} res - Response
 */
router.get('/cpd/:carparkNo', async (req, res) => {
  const carpark_details = database.connectCollection('carpark_details');
  res.status(200).send(await carpark_details.find({ ppCode: req.params.carparkNo }).toArray());
});

/**
 * GET: All carpark availability
 * @name /cpa
 * @function
 * @inner
 * @param {string} res - Response
 */
router.get('/cpa', async (req, res) => {
  const carpark_availability = database.connectCollection('carpark_availability');
  res.status(200).send(await carpark_availability.find({}).toArray());
});

/**
 * GET: Specific carpark availability
 * @name /cpa/:carparkNo
 * @function
 * @inner
 * @param {string} req - Request
 * @param {string} res - Response
 */
router.get('/cpa/:carparkNo', async (req, res) => {
  const carpark_availability = database.connectCollection('carpark_availability');
  res.status(200).send(await carpark_availability.find({ carpark_number: req.params.carparkNo }).toArray());
});

/**
 * CronJob: Carpark Details (run once a day at 0000H)
 */
nodeCron.schedule('0 0 * * *', updateCarparkDetails, { timezone: 'Singapore' });

/**
 * CronJob: Carpark Availability (run every 3 min)
 */
nodeCron.schedule('*/3 * * * *', updateCarparkAvailability, { timezone: 'Singapore' });

/**
 * To update Carpark Details
 */
async function updateCarparkDetails() {
  // To generate the daily token
  await URAAPI.getToken();
  let res = await URAAPI.getDetails();
  const carpark_details = database.connectCollection('carpark_details');

  console.log(res.data.Status);
  if (res.data.Status != 'Success') {
    const delay = (ms) => new Promise((res) => setTimeout(res, ms));
    await delay(300000);
    res = await URAAPI.getDetails();
  }

  if (res.data.Status != 'Success') {
    console.log('Failed to retrieve Carpark Details');
    return;
  }

  let pkg = massageDetails(res.data.Result);
  await carpark_details.deleteMany({});
  await carpark_details.insertMany(pkg);
  console.log('Carpark Details Updated to DB');
}

/**
 * To re-format carpark entities' details
 * @param {*} data - carpack details from URA
 * @returns {object} formatted carpark entities
 */
function massageDetails(data) {
  let pkg = [];
  data.forEach((cp) => {
    if (cp.vehCat === 'Car') {
      pkg.push(cp);
    }
  });
  pkg = pkg.reduce((acc, item) => {
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
      sunPHRate: item.sunPHRate,
    };
    acc[item.ppCode].rates.push(pricing);
    return acc;
  }, {});
  pkg = Object.keys(pkg).map((key) => {
    return pkg[key];
  });
  return pkg;
}

/**
 * To update Carpark Availabilities
 */
async function updateCarparkAvailability() {
  let res = await URAAPI.getAvailability();
  const carpark_details = database.connectCollection('carpark_details');
  let pkg = massageAvailability(res.data.Result);
  await carpark_details.bulkWrite(pkg);
  console.log('Carpark Availability Updated to DB');
}

/**
 * To re-format carpark entities' availability
 * @param {*} data - carpack details from URA
 * @returns {object} formatted carpark entities
 */
function massageAvailability(data) {
  let pkg = [];
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
      pkg.push(operation);
    }
  });
  return pkg;
}

module.exports = router;
