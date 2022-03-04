const mongodb = require('mongodb');
const axios = require('axios');

class URAAPI {
  static #accessKey = '3df68727-2825-4d0a-aee7-768b467a0815';
  // Note: need to dynamically call token
  static #token =
    'Ad0x-@5Z+NPGH6a8k69PmdF-7Q7zTge80Y-St0K7A67np5j00VvT2+@a2r@0W-8wnpDmeV8k-avHJnMfQpV0gw72Vy2-dC3XcUuE';

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
      .get('https://www.ura.gov.sg/uraDataService/invokeUraDS?service=Car_Park_Availability', {
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
}

module.exports = URAAPI;
