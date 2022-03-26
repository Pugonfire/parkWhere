/** To make an API call
 * @module api_helper
 */
const request = require('request');

module.exports = {
  /**
   * Helper function to make api call
   * @param {*} url - url of api endpoint
   */
  make_API_call: function (url) {
    return new Promise((resolve, reject) => {
      request(url, { json: true }, (err, res, body) => {
        if (err) reject(err);
        resolve(body);
      });
    });
  },
};
