<template>
  <div class="carpark_card_container">
    <div class="header_favButton">
      <FavButton class="favButton" :ppCode="carpark.ppCode" />
    </div>
    <div class="content_right">
      <div v-if="carpark.lotsAvailable != null">
        <div class="lot_numbers">{{ carpark.lotsAvailable }}/{{ carpark.parkCapacity }}</div>
        <div class="lot_caption">available lots</div>
      </div>
      <div v-else>
        <div class="lot_numbers">{{ carpark.parkCapacity }}</div>
        <div class="lot_caption">total lots</div>
      </div>
    </div>
    <div class="content_left">
      <p class="carparkTitle">
        {{ carpark.ppName }} <br />
        ({{ carpark.ppCode }})
      </p>
      <div class="rates" v-for="rate in carpark.rates" :item="rate" :key="rate._id">
        Opening Hours: {{ rate.startTime }} to {{ rate.endTime }}
        <br />
        Weekday Rate: {{ rate.weekdayRate }} for {{ rate.weekdayMin }}
        <br />
        Weekend Rate: {{ rate.sunPHRate }} for {{ rate.sunPHMin }}
      </div>
    </div>
  </div>
</template>

<script>
import FavButton from './FavButton.vue';

export default {
  props: ['carpark'],
  data() {
    return {
      favourite: false,
    };
  },
  methods: {
    toggle_favourite() {
      this.favourite = !this.favourite;
    },
  },
  components: {
    FavButton,
  },
};
</script>

<style scoped>
.carpark_card_container {
  position: relative;
  display: grid;
  grid-template-columns: 65fr 35fr;
  grid-template-rows: 40fr 60fr;
  border: 1px solid #abc2e4;
  background-color: #a1bfec;
  padding: 10px 10px 30px 10px;
  margin-bottom: 15px;
}

.header_favButton {
  grid-column-start: 2;
  grid-column-end: 3;
  grid-row-start: 1;
  grid-row-end: 2;
}

.content_right {
  grid-column-start: 2;
  grid-column-end: 3;
  grid-row-start: 2;
  grid-row-end: 3;
}

.content_left {
  grid-column-start: 1;
  grid-column-end: 2;
  grid-row-start: 1;
  grid-row-end: 3;
  text-align: left;
  padding: 0px 0px 0px 0px;
  margin: 0px 0px 0px 0px;
}

.carparkTitle {
  text-align: left;
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 0;
}

.rates {
  border: 1px solid black;
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

.favButton {
  position: absolute;
  top: 10px;
  right: 10px;
}
</style>
