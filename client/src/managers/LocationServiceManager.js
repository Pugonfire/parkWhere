class LocationServiceManager {
  #location;

  constructor() {
    this.requestPermission();
  }

  requestPermission() {
    console.log("Getting User's Location");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        console.log('Location Info Retrieved');
      },
      (error) => {
        console.log(error.message);
      }
    );
  }

  requestLocationInfo() {
    if (this.location == null) {
      this.requestPermission();
    }
    return this.location;
  }
}

export default LocationServiceManager;
