const mongodb = require('mongodb');
const axios = require('axios');

class URAAPI {
  static #accessKey = '3df68727-2825-4d0a-aee7-768b467a0815';
  // Note: need to dynamically call token
  static #token =
    'eqN21j8e2fVazRJbsz3+6d3V2Nb82-e4N48BQw78j7sFa+PQ2b0ufqbBf568+65g07euzZaJTQW4MX4-JSSXa+@H6p71MU8d482b';

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
      })
      .catch((error) => {
        console.log(error);
      });
  }

  static async getDetails() {
    if (this.#token == null) return null;
    let data = axios
      .get('https://www.ura.gov.sg/uraDataService/invokeUraDS?service=Car_Park_Details', {
        headers: {
          AccessKey: this.#accessKey,
          Token: this.#token,
        },
      })
      .then((response) => response)
      .catch((error) => {
        console.log(error);
      });
    return data;
  }

  static async getAvailability() {
    if (this.#token == null) return null;
    let data = axios
      .get('https://api.data.gov.sg/v1/transport/carpark-availability', {
        headers: {
          accept: 'application/json',
        },
      })
      .then((response) => response)
      .catch((error) => {
        console.log(error);
      });
    return data;
  }
}

module.exports = URAAPI;
