import axios from 'axios';
import SVY21 from './SVY21_to_WGS84';

const url = 'api/carpark_manager/cpd';
const converter = new SVY21();

class CarparkPinService {
  static getPins() {
    return new Promise((resolve, reject) => {
      axios
        .get(url)
        .then((res) => {
          const data = res.data;
          resolve(
            data.map((post) => ({
              coords: converter.computeLatLon(
                post.geometries[0].coordinates.split(',')[0],
                post.geometries[0].coordinates.split(',')[1]
              ),
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
