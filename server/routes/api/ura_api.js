const axios = require('axios');

class URAAPI {
  static #accessKey = '3df68727-2825-4d0a-aee7-768b467a0815';
  // Note: need to dynamically call token
  static #token =
    'dAb+Bgz6R-a0k533KN0dXUReDpkbfrDbZ64D6aG53Qs14zjw8Q-7jjTpa0aJeX9sYR3e+aHv0d2a18-jTjMNuj+dva675ymCRe36';

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
