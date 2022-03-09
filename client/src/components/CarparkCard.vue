<template>
  <div class="carpark">
    <div class="card_header">
      <div class="header_right">
        <i @click="toggle_favourite" :class="{ fav: favourite, not_fav: !favourite }"></i>
      </div>
      <div class="header_left">
        <p class="carpark_name">{{ carpark.ppName }} ()</p>
      </div>
    </div>
    <p class="lots_available">{{ carpark.parkCapacity }} available lots</p>
    <p class="carpark_details"></p>
    Carpark Code: {{ carpark.ppCode }}
    <br />
    Carpark System: {{ carpark.parkingSystem }}
    <br />
    Vehicle Type: {{ carpark.vehCat }}
    <br />
    <div class="rates" v-for="rate in carpark.rates" :item="rate" :key="rate._id">
      Opening Hours: {{ rate.startTime }} to {{ rate.endTime }}
      <br />
      Weekday Rate: {{ rate.weekdayRate }} for {{ rate.weekdayMin }}
      <br />
      Weekend Rate: {{ rate.sunPHRate }} for {{ rate.sunPHMin }}
    </div>
  </div>
</template>

<script>
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
};
</script>

<style scoped>
i {
  cursor: pointer;
  display: inline-block;
  transition: 0.2s;
}

i.not_fav {
  color: white;
}

i.fav {
  color: red;
}

i:before {
  font-family: fontawesome;
  content: '\f004';
  font-style: normal;
  font-size: 30px;
}

i:hover {
  color: grey;
}

img.favourite {
  max-width: 10%;
  max-height: 10%;
}

div.carpark {
  position: relative;
  border: 1px solid #abc2e4;
  background-color: #a1bfec;
  padding: 10px 10px 30px 10px;
  margin-bottom: 15px;
}

div.rates {
  border: 1px solid black;
  background-color: white;
}

p.carpark_name {
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 0;
}

p.lots_available {
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 0;
}

p.carpark_details {
  text-align: left;
  font-size: 15px;
  font-weight: 500;
  margin-bottom: 0;
}
</style>
