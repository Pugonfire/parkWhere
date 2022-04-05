<template>
  <div class="popup">
    <div class="popup-inner">
      <div class="basicInformation">
        <h1>{{ cp.ppName }}</h1>
        <h2>{{ cp.ppCode }}</h2>
        <div id="carparkavailability">
          <h3>Availability</h3>
          <i class="fa-solid fa-car"></i>
          <div v-if="Available">
            <p v-if="cp.lotsAvailable <= cp.parkCapacity">{{ cp.lotsAvailable }}/{{ cp.parkCapacity }}</p>
            <p v-else>{{ cp.parkCapacity }}/{{ cp.parkCapacity }}</p>
          </div>
          <div v-else>
            <p>{{ cp.parkCapacity }} lots available</p>
          </div>
        </div>
        <iframe width="350" height="450" style="border: 0" loading="lazy" allowfullscreen :src="getSource()"> </iframe>
        <h2>Rates & Charges</h2>
        <div class="rates" v-for="rate in cp.rates" :item="rate" :key="rate._id">
          Opening Hours: {{ rate.startTime }} to {{ rate.endTime }}
          <br />
          Weekday Rate: {{ rate.weekdayRate }} for {{ rate.weekdayMin }}
          <br />
          Weekend Rate: {{ rate.sunPHRate }} for {{ rate.sunPHMin }}
        </div>
      </div>
    </div>
    <button @click="takemethere()">Take Me There</button>
  </div>
</template>

<script>
import SearchService from '../SearchService.js';
import SVY21 from '../SVY21_to_WGS84';

export default {
  data() {
    return {
      cp: {},
      map: null,
      available: true,
      dest: null,
      source: null,
      Available: true,
    };
  },
  props: ['ppName'],
  async created() {
    let carpark = null;
    carpark = await SearchService.search({
      ppName: this.ppName,
    });
    console.log(carpark.data[0]);
    this.cp = carpark.data[0];
    console.log(carpark);
    if (this.cp.lotsAvailable) {
      this.available == false;
    }
    const converter = new SVY21();
    this.cp.coord = converter.computeLatLon(
      this.cp.geometries[0].coordinates.split(',')[0],
      this.cp.geometries[0].coordinates.split(',')[1]
    );
    this.dest = this.cp.coord.lat + ',' + this.cp.coord.lng;
    this.source = 'https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY' + '&zoom=17' + '&q=' + this.ppName;
    console.log(this.source);
    if (!('lotsAvailable' in this.cp)) {
      this.Available = false;
    }
    console.log(this.Available);
  },
  methods: {
    takemethere() {
      window.location.href = 'https://www.google.com/maps/search/?api=1&query=' + this.dest;
    },
    getSource() {
      return this.source;
    },
  },
};
</script>

<style>
.popup {
  /* position: fixed; */
  overflow: hidden;
  /* overflow-y: scroll; */
  z-index: 99;
  background-color: rgb(255, 255, 255);
  display: flex;
  align-items: center;
  justify-content: center;
}
.popup-inner {
  background: #fff;
  padding: 0 32px;
  padding-bottom: 60px;
}
.basicInformation {
  text-align: left;
  border-bottom: 1px;
}

.basicInformation h1 {
  margin: 0;
}

.basicInformation h2 {
  border-top: 1px;
}

#carparkavailability {
  text-align: center;
  font-size: 20px;
}
.fa-solid.fa-car {
  font-size: 50px;
}
.popup button {
  background-color: #3c81bb;
  border: none;
  border-radius: 10px;
  color: rgb(255, 255, 255);
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  width: 93%;
  position: fixed;
  bottom: 80px;
  font-family: 'Montserrat';
}
</style>
