import axios from 'axios';

const url = 'api/carpark_manager/cpd';

class CarparkPinService {
  static getPins() {
    return new Promise((resolve, reject) => {
      axios
        .get(url)
        .then((res) => {
          const data = res.data;
          resolve(
            data.map((post) => ({
              geo: post.geometries,
            }))
          );
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
}

export default CarparkPinService;
