import axios from 'axios';

const details_url = 'http://localhost:5000/api/carpark_manager/cpd/';

class CarparkService {
  static getCarparkDetails() {
    return new Promise((resolve, reject) => {
      axios
        .get(details_url)
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
}

export default CarparkService;
