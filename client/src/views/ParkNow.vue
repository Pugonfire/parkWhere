<template>
  <div>
    <h4>Sample Carpark Data (2 entries)</h4>
    <div v-for="index in 2" :key="index">
      {{ pins[index] }}
    </div>
    <h4>Click to update the map to your locality. (it may take some time to load)</h4>
    <button @click="getLocation">Get my Location</button>
    <h4>Drag the map around, click to console log carparks within the current map view.</h4>
    <button @click="logCurrentCarparks">Console Log Current Carparks</button>
    <!-- <h4>Click to console log carparks, arranged by distance to the center of the map.</h4>
    <button @click="orderCarparks">Order carparks</button> -->
    <h4>Map</h4>
    <div id="map" style="width: 100%; height: 600px"></div>
  </div>
</template>

<script>
import { Loader } from '@googlemaps/js-api-loader';
import CarparkPinService from '../CarparkPinService';

export default {
  name: 'ParkNow',
  data() {
    return {
      google: null,
      map: null,
      mapOptions: {
        center: {
          // lat: 1.3521,
          // lng: 103.8198,
          lat: 1.35843,
          lng: 103.92694,
        },
        zoom: 17,
      },
      center: {
        lat: 1.3521,
        lng: 103.8198,
      },
      pins: [],
      candidates: [],
      myMarker: null,
    };
  },
  async mounted() {
    await this.loadPins();
    await this.loadMapAPI();
    this.initMap();
    this.initMarkers();
    new this.google.maps.Marker({ position: { lat: 1.36011, lng: 103.92643 }, title: 'Origin', map: this.map });
  },
  methods: {
    orderCarparks() {
      console.log();
    },
    async logCurrentCarparks() {
      this.candidates = [];
      this.pins.forEach((pin) => {
        if (this.map.getBounds().contains(pin.coords)) {
          this.candidates.push(pin);
          // console.log(pin);
          // let service = new this.google.maps.DistanceMatrixService();
          // service.getDistanceMatrix(
          //   {
          //     origins: [{ lat: 1.36011, lng: 103.92643 }],
          //     destinations: [pin.coords],
          //     travelMode: 'DRIVING',
          //   },
          //   this.distanceCallback
          // );
        }
      });
      this.candidates = [...new Map(this.candidates.map((item) => [item['ppCode'], item])).values()];
      console.log(this.candidates);
    },
    distanceCallback(res) {
      console.log(res);
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
        new this.google.maps.Marker({ position: pin.coords, title: pin.ppName, map: this.map });
      });
    },
    getLocation() {
      console.log("Getting User's Location");
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.center = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          console.log('Location Info Retrieved');
          if (this.myMarker != null) {
            this.myMarker.setPosition(this.center);
          } else {
            this.myMarker = new this.google.maps.Marker({
              position: this.center,
              title: 'You',
              map: this.map,
            });
          }
          this.map.setCenter(this.center);
          this.map.setZoom(17);
        },
        (error) => {
          console.log(error.message);
        }
      );
    },
  },
};
</script>
