<template>
  <div>
    <h4>Sample Carpark Data (2 entries)</h4>
    <div v-for="index in 2" :key="index">
      {{ pins[index] }}
    </div>
    <h4>Click on the button to update the map to your locality. (it may take some time to load)</h4>
    <button @click="getLocation">Get my Location</button>
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
          lat: 1.3521,
          lng: 103.8198,
        },
        zoom: 12,
      },
      center: {
        lat: 1.3521,
        lng: 103.8198,
      },
      pins: [],
    };
  },
  async created() {},
  async mounted() {
    await this.loadPins();
    await this.loadMapAPI();
    this.initMap();
    this.initMarkers();
  },
  methods: {
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
