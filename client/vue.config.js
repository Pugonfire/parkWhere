const path = require('path');

module.exports = {
  outputDir: path.resolve(__dirname, '../server/public'),
  devServer: {
    proxy: {
      '/api': {
        target: process.env.VUE_APP_API_URL,
      },
    },
  },
};
