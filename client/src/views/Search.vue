<template>
  <div>
    <h1>Search Carpark</h1>
    <input type="text" v-model="user_search" v-on:input="searchCarparks" />
    <p>{{ user_search }}</p>
    <div v-for="carpark in filtered" :item="carpark" :key="carpark._id">
      <CarparkCard :carpark="carpark" />
    </div>
  </div>
</template>

<script>
import CarparkCard from '../components/CarparkCard.vue';
import CarparkService from '../CarparkService.js';

export default {
  data() {
    return {
      user_search: '',
      carparks: [],
      filtered: [],
    };
  },
  components: {
    CarparkCard,
  },
  methods: {
    searchCarparks() {
      let filtered_carparks = this.carparks;
      if (filtered_carparks) {
        filtered_carparks = filtered_carparks.filter((carpark) =>
          carpark.ppName.toLowerCase().includes(this.user_search)
        );
        console.log(filtered_carparks);
        this.filtered = filtered_carparks;
      }
      // return filtered_carparks;
      // } else return null;
    },
  },
  async created() {
    try {
      this.carparks = await CarparkService.getCarparkDetails();
    } catch (error) {
      console.log('error in search create');
    }
  },
};
</script>

<style></style>
