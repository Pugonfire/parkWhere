<template>
  <div class="basicInformation">
    <h1>{{ cp.ppName }}</h1>
    <h2>{{ cp.ppCode }}</h2>
    <div id="carparkavailability">
      <h3>Availability</h3>
      <i class="fa-solid fa-car"></i>
      <div v-if="Available">
        <p>{{ cp.lotsAvailable }}/{{ cp.parkCapacity }}</p>
      </div>
      <div v-else>
        <p>Carkpark information not available</p>
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
  async created() {
    let carpark = null;
    carpark = await SearchService.search({
      ppName: 'Ang Mo Kio',
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
    this.source = 'https://www.google.com/maps/embed/v1/view?key=YOUR_API_KEY&center=' + this.dest + '&zoom=18';
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
<style scoped>
.basicInformation {
  text-align: left;
  border-bottom: 1px;
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
.basicInformation button {
  background-color: #1800a3;
  border: none;
  color: rgb(178, 252, 7);
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  width: 100%;
}
</style>
