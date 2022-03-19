import axios from 'axios';

export default {
  search(input) {
    return axios.post('http://localhost:5000/api/search_manager/search', input);
  },
  getCarparks(carparks) {
    return axios.post('http://localhost:5000/api/search_manager/recentcarparks', {
      content: carparks,
    });
  },
};
