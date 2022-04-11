class LocationServiceManager {
  static async requestPermission() {
    // let location = null;
    console.log("Getting User's Location");
    const pos = await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
    console.log('Location Info Retrieved');
    return {
      lng: pos.coords.longitude,
      lat: pos.coords.latitude,
    };
  }
}

export default LocationServiceManager;
