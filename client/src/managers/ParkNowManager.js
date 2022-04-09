class ParkNowManager {
  static async findCarpark(google, origin, carparks, radius) {
    let candidates = this.filterCarparks(google, origin, carparks, radius);

    if (candidates.length == 0) {
      return false;
    }

    let dest = [];
    candidates.forEach((cp) => {
      dest.push(cp.coords);
    });
    console.log('Getting distances...');
    console.log(candidates);

    let service = new google.maps.DistanceMatrixService();
    let bestCP = service
      .getDistanceMatrix({
        origins: [origin],
        destinations: dest,
        travelMode: 'DRIVING',
      })
      .then((response) => {
        let bestCP = '';
        let bestCPIdx = -1;
        let minDuration = Infinity;

        let origins = response.originAddresses;
        let destinations = response.destinationAddresses;
        for (let i = 0; i < origins.length; i++) {
          let resultList = response.rows[i].elements;
          for (let j = 0; j < resultList.length; j++) {
            let element = resultList[j];
            let distance = element.distance.text;
            let duration = element.duration.text;
            let from = origins[i];
            let to = destinations[j];
            console.log('Distance:', distance, 'Duration:', duration, 'From:', from, 'To:', to);

            if (element.duration.value < minDuration) {
              minDuration = element.duration.value;
              bestCPIdx = i;
            }
          }
        }
        bestCP = candidates[bestCPIdx].ppName;
        return bestCP;
      });

    return bestCP;
  }

  static filterCarparks(google, origin, carparks, radius) {
    let candidates = [];
    carparks.forEach((cp) => {
      if (cp.lotsAvailable != null) {
        if (cp.lotsAvailable == 0 || cp.lotsAvailable < 0 || cp.lotsAvailable > cp.parkCapacity) {
          return;
        }
      }
      let distance = google.maps.geometry.spherical.computeDistanceBetween(cp.coords, origin);
      if (distance < radius) {
        candidates.push(cp);
      }
    });
    return candidates;
  }
}

export default ParkNowManager;
