const express = require('express');
const mongodb = require('mongodb');
// const api_helper = require('./api_helper');
const axios = require('axios');

const router = express.Router();

// temp token
let token = '1e8385JKCGed-YdQ8--8H0Xe6a0858ReC54v7-5agNfyad6NZX72Zwa08G-3uaG8d7ea@fK4c3A487u-@@-nyS0sSd-r7@CqM774';
let results = null;

router.get('/getToken', async (req, res) => {
  axios
    .get('https://www.ura.gov.sg/uraDataService/insertNewToken.action', {
      headers: {
        AccessKey: '3df68727-2825-4d0a-aee7-768b467a0815',
      },
    })
    .then((response) => {
      console.log(response.data);
      token = response.data.Result;
    });
});

// need to get fresh token
router.get('/getInfo', async (req, res) => {
  console.log(token);
  axios
    .get('https://www.ura.gov.sg/uraDataService/invokeUraDS?service=Car_Park_Details', {
      headers: {
        AccessKey: '3df68727-2825-4d0a-aee7-768b467a0815',
        Token: token,
      },
    })
    .then((response) => {
      console.log(response.data);
      results = response.data.Result;
    })
    .catch((error) => {
      console.log(error);
    })
    .finally();
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

router.get('/getResults', () => {
  console.log(results);
});

module.exports = router;