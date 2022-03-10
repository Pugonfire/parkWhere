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
        let results = response.rows[0].elements;
        let bestCP = results.reduce(function (prev, current) {
          return prev.distance.value < current.distance.value ? prev : current;
        });

        // Print results array
        // var origins = response.originAddresses;
        // var destinations = response.destinationAddresses;
        // for (var i = 0; i < origins.length; i++) {
        //   var resultList = response.rows[i].elements;
        //   for (var j = 0; j < resultList.length; j++) {
        //     var element = resultList[j];
        //     var distance = element.distance.text;
        //     var duration = element.duration.text;
        //     var from = origins[i];
        //     var to = destinations[j];
        //     console.log('Distance:', distance, 'Duration:', duration, 'From:', from, 'To:', to);
        //   }
        // }

        return bestCP;
      });
    return bestCP;
  }

  static filterCarparks(google, origin, carparks, radius) {
    let candidates = [];
    carparks.forEach((cp) => {
      if (cp.lotsAvailable) {
        if (cp.lotsAvailable == 0) {
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
