<template>
  <div class="carpark_card_container">
    <div class="header_favButton">
      <FavButton class="favButton" :ppName="carpark.ppName" />
    </div>
    <div @click="click_card" class="content_right">
      <div v-if="carpark.lotsAvailable != null && carpark.lotsAvailable > 0">
        <div class="lot_numbers">{{ carpark.lotsAvailable }}/{{ carpark.parkCapacity }}</div>
        <div class="lot_caption">available lots</div>
      </div>
      <div v-else-if="carpark.lotsAvailable != null && carpark.lotsAvailable == 0">
        <div class="lot_numbers">FULL</div>
      </div>
      <div v-else>
        <div class="lot_numbers">{{ carpark.parkCapacity }}</div>
        <div class="lot_caption">total lots</div>
      </div>
    </div>
    <div @click="click_card" class="content_left">
      <p class="carparkTitle">
        {{ carpark.ppName }} <br />
        ({{ carpark.ppCode }})
      </p>
      <div class="rates" v-for="rate in carpark.rates" :item="rate" :key="rate._id">
        Opening Hours: {{ rate.startTime }} to {{ rate.endTime }}
        <br />
        Weekday Rate: {{ rate.weekdayRate }} for {{ rate.weekdayMin }}
        <br />
        Sat Rate: {{ rate.satdayRate }} for {{ rate.satdayMin }}
        <br />
        Sun/PH Rate: {{ rate.sunPHRate }} for {{ rate.sunPHMin }}
      </div>
    </div>
  </div>
</template>

<script>
import FavButton from './FavButton.vue';
import global from '../global';
import UserService from '../UserService';

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
    click_card() {
      if (!global.user_history.includes(this.carpark.ppName)) {
        global.user_history.push(this.carpark.ppName);
        if (global.user_history.length > 10) global.user_history.shift();
      }
      console.log(global.user_history);
      UserService.updateUser(global.user_email, 'searchHistory', global.user_history);
      this.$router.push({
        name: 'Details',
        params: {
          ppName: this.carpark.ppName,
        },
      });
    },
  },
  components: {
    FavButton,
  },
};
</script>

<style scoped>
@import '../assets/main.css';

.carpark_card_container {
  position: relative;
  display: grid;
  grid-template-columns: 65fr 35fr;
  grid-template-rows: 40fr 60fr;
  background-color: white;
  box-shadow: 0px 10px 15px;
  border-radius: 8px;
  padding: 10px 10px 30px 10px;
  margin: 0px 20px 30px 20px;
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
  border: 1px solid grey;
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
  top: 20px;
  right: 20px;
}
</style>
