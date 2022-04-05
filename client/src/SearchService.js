import axios from 'axios';

const endpoint = process.env.VUE_APP_API_URL;

export default {
  search(input) {
    return axios.post(endpoint + '/api/search_manager/search', input);
  },
  getCarparks(carparks) {
    return axios.post(endpoint + '/api/search_manager/recentcarparks', {
      content: carparks,
    });
  },
};
