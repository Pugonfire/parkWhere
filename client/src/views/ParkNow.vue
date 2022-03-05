<template>
  <div>
    <h4>Sample Carpark Data (2 entries)</h4>
    <div v-for="index in 2" :key="index">
      {{ pins[index] }}
    </div>

    <h4>Click to update the map to your locality. (Please wait for location to be retrieved)</h4>
    <button @click="getLocation">Get my Location</button>

    <h4>Drag the map around, click to console log carparks within the current map view.</h4>
    <button @click="logCurrentCarparks">Console Log Current Carparks</button>

    <h4>Drag the map around, click to console log carparks with their distances. (requires API key)</h4>
    <button @click="orderCarparks">Order carparks</button>

    <h4>Map</h4>
    <div id="map" style="width: 100%; height: 600px"></div>
  </div>
</template>

<script>
import { Loader } from '@googlemaps/js-api-loader';
import CarparkPinService from '../CarparkPinService';
import LocationServiceManager from '../managers/LocationServiceManager';
import ParkNowManager from '../managers/ParkNowManager';

export default {
  name: 'ParkNow',
  data() {
    return {
      google: null,
      map: null,
      mapOptions: {
        center: {
          // Singapore Central Coords
          // lat: 1.3521,
          // lng: 103.8198,
          lat: 1.33251,
          lng: 103.95479,
        },
        zoom: 16,
      },
      center: {
        lat: 1.33251,
        lng: 103.95479,
      },
      pins: [],
      candidates: [],
      myMarker: null,
      locSvcMng: null,
      infoWindows: [],
    };
  },
  async mounted() {
    this.locSvcMng = new LocationServiceManager();
    await this.loadMapAPI();
    await this.loadPins();
    this.initMap();
    this.initMarkers();

    // Testing Code for Distance
    new this.google.maps.Marker({ position: this.center, title: 'Origin', map: this.map });
  },
  methods: {
    async orderCarparks() {
      this.candidates = [];
      this.pins.forEach((pin) => {
        if (this.map.getBounds().contains(pin.coords)) {
          this.candidates.push(pin);
        }
      });
      this.candidates = [...new Map(this.candidates.map((item) => [item['ppCode'], item])).values()];

      await ParkNowManager.findCarpark(this.google, this.center, this.candidates);
    },
    async logCurrentCarparks() {
      this.candidates = [];
      this.pins.forEach((pin) => {
        if (this.map.getBounds().contains(pin.coords)) {
          this.candidates.push(pin);
        }
      });
      this.candidates = [...new Map(this.candidates.map((item) => [item['ppCode'], item])).values()];
      console.log(this.candidates);
    },
    async loadPins() {
      try {
        this.pins = await CarparkPinService.getPins();
      } catch (err) {
        this.error = err.message;
      }
    },
    async loadMapAPI() {
      const googleMapApi = new Loader({
        apiKey: '',
        version: 'weekly',
        libraries: ['places'],
      });
      this.google = await googleMapApi.load();
    },
    initMap() {
      this.map = new this.google.maps.Map(document.getElementById('map'), this.mapOptions);
    },
    initMarkers() {
      this.pins.forEach((pin) => {
        let marker = new this.google.maps.Marker({ position: pin.coords, title: pin.ppName, map: this.map });
        let contentString = this.pinInfo(pin);
        let infoWindow = new this.google.maps.InfoWindow({
          content: contentString,
        });
        this.infoWindows.push(infoWindow);
        marker.addListener('click', () => {
          this.infoWindows.forEach((i) => {
            i.close();
          });
          infoWindow.open({
            anchor: marker,
            map: this.map,
            shouldFocus: false,
          });
        });
      });
    },
    pinInfo(cp) {
      let contentString = '<div class="info-window">';

      contentString += '<h5>' + cp.ppName + '</h5>';
      if (cp.lotsAvailable) {
        contentString += '<span>' + cp.lotsAvailable + ' / ' + cp.parkCapacity + '</span>';
      }
      contentString += '<strong>Rates & Charges</strong>';

      contentString += '<br>';

      let dest = cp.coords.lat + ',' + cp.coords.lng;
      contentString += '<a target="_blank" href="https://www.google.com/maps/search/?api=1&query=' + dest + '">';
      contentString += 'Take me there';
      contentString += '</a>';

      contentString += '</div>';
      return contentString;
    },
    getLocation() {
      console.log(this.locSvcMng.requestLocationInfo());
      // console.log("Getting User's Location");
      // navigator.geolocation.getCurrentPosition(
      //   (position) => {
      //     this.center = {
      //       lat: position.coords.latitude,
      //       lng: position.coords.longitude,
      //     };
      //     console.log('Location Info Retrieved');
      //     if (this.myMarker != null) {
      //       this.myMarker.setPosition(this.center);
      //     } else {
      //       this.myMarker = new this.google.maps.Marker({
      //         position: this.center,
      //         title: 'You',
      //         map: this.map,
      //       });
      //     }
      //     this.map.setCenter(this.center);
      //     this.map.setZoom(17);
      //   },
      //   (error) => {
      //     console.log(error.message);
      //   }
      // );
    },
  },
};
</script>
