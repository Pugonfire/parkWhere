<template>
  <div>
    <h1>Search</h1>
    <div class="Searchbar">
      <input type="ppName" name="ppName" v-model="ppName" placeholder="Enter name of carpark" />
      <button @click="search">Search</button>
    </div>
    <hr />
    <div class="carpark-container">
      <div class="carpark" v-for="carpark in carparks.data" v-bind:item="carpark" v-bind:key="carpark._id">
        <p class="ppName">{{ carpark.ppName }}</p>
        <p class="body">
          <b>Carpark Code:</b> {{ carpark.ppCode }}
          <br />
          <b>Vehicle Type:</b> {{ carpark.vehCat }}
          <br />
          <b>Weekday Rates:</b> {{ carpark.weekdayRate }} per {{ carpark.weekdayMin }} <br /><b>Saturday Rates:</b>
          {{ carpark.satdayRate }} per {{ carpark.satdayMin }} <br /><b>Sunday/Public Holiday Rates:</b>
          {{ carpark.sunPHRate }} per {{ carpark.sunPHMin }} <br /><b>Effective start to end of parking rate:</b>
          {{ carpark.startTime }} to
          {{ carpark.endTime }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import SearchService from '../SearchService';
export default {
  data() {
    return {
      ppName: '',
      carparks: [],
    };
  },
  methods: {
    async search() {
      this.carparks = await SearchService.search({
        ppName: this.ppName,
      });
      console.log('Results returned');
      this.text = '';
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
div.container {
  max-width: 800px;
  margin: 0 auto;
}

div.carpark-container {
  max-width: 500px;
  margin: 0 auto;
}

p.error {
  border: 1px solid #ff5b5f;
  background-color: #ffc5c1;
  padding: 10px;
  margin-bottom: 15px;
}

div.carpark {
  position: relative;
  border: 1px solid #abc2e4;
  background-color: #a1bfec;
  padding: 10px 10px 30px 10px;
  margin-bottom: 15px;
}

p.ppName {
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 0;
}
p.ppName {
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 0;
}

p.body {
  text-align: left;
  font-size: 15px;
  font-weight: 500;
  margin-bottom: 0;
}
</style>
