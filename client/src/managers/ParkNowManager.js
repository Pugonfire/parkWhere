class ParkNowManager {
  static async findCarpark(google, origin, carparks) {
    let dest = [];
    carparks.forEach((cp) => {
      console.log(cp.ppName);
      dest.push(cp.coords);
    });
    console.log(dest);

    console.log('Getting distances...');

    let service = new google.maps.DistanceMatrixService();
    service
      .getDistanceMatrix({
        origins: [origin],
        destinations: dest,
        travelMode: 'DRIVING',
      })
      .then((response) => {
        var origins = response.originAddresses;
        var destinations = response.destinationAddresses;

        for (var i = 0; i < origins.length; i++) {
          var results = response.rows[i].elements;
          for (var j = 0; j < results.length; j++) {
            var element = results[j];
            var distance = element.distance.text;
            var duration = element.duration.text;
            var from = origins[i];
            var to = destinations[j];
            console.log('Distance:', distance, 'Duration:', duration, 'From:', from, 'To:', to);
          }
        }
      });
  }
}

export default ParkNowManager;
