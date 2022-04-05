/**
 * Boundary class to interact with URA's carpark api
 * URA's carpark api: https://www.ura.gov.sg/maps/api/
 *
 * @class URAAPI
 * @requires axios
 */
const axios = require('axios');
const { accessKey } = require('../config');

class URAAPI {
  static #accessKey = accessKey;
  // Note: need to get new token daily. Token here is a dummy token
  static #token =
    'dAb+Bgz6R-a0k533KN0dXUReDpkbfrDbZ64D6aG53Qs14zjw8Q-7jjTpa0aJeX9sYR3e+aHv0d2a18-jTjMNuj+dva675ymCRe36';

  /**
   * Get URA token. Token to be renewed everyday
   * @return {string} token
   */
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

  /**
   * Query carpark details
   * @return {object} carparkDetails.json
   */
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

  /**
   * Query carpark availability for all carparks
   * To be refreshed every 3 min
   * @return {object} carparkAvailability.json
   */
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
