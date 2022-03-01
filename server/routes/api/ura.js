const mongodb = require('mongodb');
const axios = require('axios');

class URAAPI {
  static #accessKey = '3df68727-2825-4d0a-aee7-768b467a0815';
  // Note: change token
  static #token =
    '1e8385JKCGed-YdQ8--8H0Xe6a0858ReC54v7-5agNfyad6NZX72Zwa08G-3uaG8d7ea@fK4c3A487u-@@-nyS0sSd-r7@CqM774';

  static async getToken() {
    axios
      .get('https://www.ura.gov.sg/uraDataService/insertNewToken.action', {
        headers: {
          AccessKey: this.#accessKey,
        },
      })
      .then((response) => {
        console.log(response.data);
        this.#token = response.data.Result;
      });
  }

  static async getDetails() {
    if (this.#token == null) return null;
    let status = null;
    axios
      .get('https://www.ura.gov.sg/uraDataService/invokeUraDS?service=Car_Park_Details', {
        headers: {
          AccessKey: this.#accessKey,
          Token: this.#token,
        },
      })
      .then((response) => {
        console.log('Data received');
        return response;
      })
      .catch((error) => {
        console.log(error);
        return null;
      });
  }

  static async getAvailability() {
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
  }
}

module.exports = URAAPI;
