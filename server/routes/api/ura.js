const express = require('express');
const mongodb = require('mongodb');
// const api_helper = require('./api_helper');
const axios = require('axios');

const router = express.Router();

let token = null;

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
  //axios;
  //     .get(
  //       "https://www.ura.gov.sg/uraDataService/invokeUraDS?service=Car_Park_Details",
  //       {
  //         headers: {
  //           AccessKey: "3df68727-2825-4d0a-aee7-768b467a0815",
  //           Token:
  //             "82rdXS3rpd4kT3M8qn687-4P3tg7th4dR72SC7-2d5b6yF@d0690bJ257JCF66bf9-hh4qnB886+pY7-gdB--dHM0m7ak-E9aFdf",
  //         },
  //       }
  //     )
  //     .then((response) => {
  //       this.info = response.data;
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //       this.errored = true;
  //     })
  //     .finally(() => (this.loading = false));
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

module.exports = router;
