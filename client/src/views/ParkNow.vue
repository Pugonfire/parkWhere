<template>
  <div>
    <h4>Drag the map around, click to console log carparks within the current map view.</h4>
    <button @click="logCurrentCarparks">Console Log Current Carparks</button>

    <h4>Drag the map around, click to console log carparks with their distances. (requires API key)</h4>
    <button @click="orderCarparks">Order carparks</button>
    <div id="map" style="width: 100%; height: 80vh"></div>
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
      myLocation: {
        lat: 1.33251,
        lng: 103.95479,
      },

      candidates: [],

      google: null,
      map: null,
      locSvcMng: null,
      myMarker: null,
      pins: [],
      infoWindows: [],
      mapOptions: {
        center: {
          // Singapore Central Coords
          // lat: 1.3521,
          // lng: 103.8198,
          lat: 1.33251,
          lng: 103.95479,
        },
        zoom: 16,
        mapTypeControl: false,
        streetViewControl: false,
        zoomControl: false,
        fullscreenControl: false,
      },
      parkNowStartButton: null,
      parkNowCancelButton: null,
    };
  },
  async mounted() {
    this.locSvcMng = new LocationServiceManager();
    await this.loadMapAPI();
    await this.loadCarparkPins();
    this.initMap();
    this.initMarkers();
    this.parkNowStartButton = this.parkNowButton('fa-solid fa-car', '30px', 'ParkNow', '#3c81bb', this.parkNowClick);
    this.parkNowCancelButton = this.parkNowButton('fa-solid fa-xmark', '30px', 'Cancel', '#ff0000', this.parkNowCancel);
    this.loadParkNowButton(this.parkNowStartButton);

    // Testing Code for Distance
    new this.google.maps.Marker({ position: this.myLocation, title: 'Origin', map: this.map });
  },
  methods: {
    startParkNow() {
      this.parknow_clicked = true;
      this.searching = true;
      this.found = false;
      this.search_distance = 500;
    },
    cancelParkNow() {
      this.parknow_clicked = false;
    },
    async orderCarparks() {
      this.candidates = [];
      this.pins.forEach((pin) => {
        if (this.map.getBounds().contains(pin.coords)) {
          this.candidates.push(pin);
        }
      });

      await ParkNowManager.findCarpark(this.google, this.myLocation, this.candidates);
    },
    async logCurrentCarparks() {
      this.candidates = [];
      this.pins.forEach((pin) => {
        // this.candidates.push(pin);
        let distance = this.google.maps.geometry.spherical.computeDistanceBetween(pin.coords, this.myLocation);
        if (distance < 927) {
          this.candidates.push(pin);
          console.log(distance);
        }
      });
      console.log(this.candidates);
    },
    async loadMapAPI() {
      const googleMapApi = new Loader({
        apiKey: '',
        version: 'weekly',
        libraries: ['places', 'geometry'],
      });
      this.google = await googleMapApi.load();
    },
    async loadCarparkPins() {
      try {
        this.pins = await CarparkPinService.getPins();
      } catch (err) {
        this.error = err.message;
      }
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

      contentString += '<p class="carparkTitle">' + cp.ppName + '</p>';
      if (cp.lotsAvailable != null && cp.lotsAvailable > 0) {
        contentString += '<div class="lot_numbers">' + cp.lotsAvailable + ' / ' + cp.parkCapacity + '</div>';
        contentString += '<div class="lot_caption">available lots</div>';
      } else if (cp.lotsAvailable != null && cp.lotsAvailable == 0) {
        contentString += '<div class="lot_numbers">FULL</div>';
      } else {
        contentString += '<div class="lot_numbers">' + cp.parkCapacity + '</div>';
        contentString += '<div class="lot_caption">total lots</div>';
      }

      contentString += '<br>';

      let dest = cp.coords.lat + ',' + cp.coords.lng;
      contentString += '<a target="_blank" href="https://www.google.com/maps/search/?api=1&query=' + dest + '">';
      contentString += 'Take me there';
      contentString += '</a>';

      contentString += '</div>';
      return contentString;
    },
    parkNowButton(iconClass, iconSize, textContent, buttonColor, clickFunction) {
      const content = document.createElement('div');
      content.style.backgroundColor = buttonColor;
      content.style.borderRadius = '8px';
      content.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
      content.style.cursor = 'pointer';
      content.style.textAlign = 'center';
      content.style.padding = '15px';
      content.style.display = 'inline-block';
      content.style.width = '60px';
      content.style.marginBottom = '30px';

      const icon = document.createElement('i');
      icon.className = iconClass;
      icon.style.fontSize = iconSize;
      icon.style.color = '#fff';

      const text = document.createElement('div');
      text.style.color = '#fff';
      text.style.fontSize = '14px';
      text.style.fontWeight = '600';
      text.style.marginTop = '5px';
      text.innerHTML = textContent;

      content.addEventListener('click', clickFunction);

      content.appendChild(icon);
      content.appendChild(text);

      return content;
    },
    parkNowStatusWindow(state, radius = 0) {
      const content = document.createElement('div');
      content.style.backgroundColor = '#fff';
      content.style.borderRadius = '8px';
      content.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
      content.style.textAlign = 'center';
      content.style.padding = '20px';
      content.style.width = '50%';

      const headerText = document.createElement('div');
      headerText.style.color = '#000';
      headerText.style.fontSize = '14px';
      headerText.style.marginBottom = '15px';

      const icon = document.createElement('i');
      icon.style.fontSize = '45px';

      const footerText = document.createElement('div');
      // footerText.style.color = '#000';
      footerText.style.fontSize = '14px';
      footerText.style.marginTop = '15px';

      switch (state) {
        case 'Searching':
          headerText.innerHTML = 'Searching for the best carpark within...';
          icon.className = 'fas fa-spinner fa-spin';
          icon.style.color = '#3c81bb';
          footerText.innerHTML = radius + ' meters';
          break;
        case 'Found':
          headerText.innerHTML = 'Carpark Found!';
          icon.className = 'fa-solid fa-check';
          icon.style.color = '#35fc03';
          break;
        case 'Not Found':
          headerText.innerHTML = 'No carparks found!';
          icon.className = 'fa-solid fa-xmark';
          icon.style.color = '#ff0000';
          footerText.innerHTML = 'Please try again.';
          break;
      }

      content.appendChild(headerText);
      content.appendChild(icon);
      content.appendChild(footerText);

      return content;
    },
    async parkNowClick() {
      let radius1 = 100;
      let radius2 = 200;

      this.loadParkNowButton(this.parkNowCancelButton);
      this.loadParkNowInfoWindow(this.parkNowStatusWindow('Searching', radius1));

      let bestCP = await ParkNowManager.findCarpark(this.google, this.myLocation, this.pins, radius1);
      if (!bestCP) {
        console.log('Increasing Search Radius');
        this.loadParkNowInfoWindow(this.parkNowStatusWindow('Searching', radius2));
        bestCP = await ParkNowManager.findCarpark(this.google, this.myLocation, this.pins, radius2);
      }
      if (!bestCP) {
        console.log('No available carparks found.');
        this.loadParkNowInfoWindow(this.parkNowStatusWindow('Not Found', radius2));
      } else {
        console.log('Best Carpark:');
        console.log(bestCP);
        this.loadParkNowInfoWindow(this.parkNowStatusWindow('Found'));
      }
    },
    parkNowCancel() {
      this.loadParkNowButton(this.parkNowStartButton);
      this.map.controls[this.google.maps.ControlPosition.CENTER].clear();
    },
    loadParkNowButton(button) {
      this.map.controls[this.google.maps.ControlPosition.BOTTOM_CENTER].clear();
      this.map.controls[this.google.maps.ControlPosition.BOTTOM_CENTER].push(button);
    },
    loadParkNowInfoWindow(window) {
      this.map.controls[this.google.maps.ControlPosition.CENTER].clear();
      this.map.controls[this.google.maps.ControlPosition.CENTER].push(window);
    },
  },
};
</script>

<style>
.carparkTitle {
  text-align: center;
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 0;
}

.lot_numbers {
  font-size: 30px;
  font-weight: 900;
  margin-bottom: 0;
}

.lot_caption {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 0;
}
</style>
