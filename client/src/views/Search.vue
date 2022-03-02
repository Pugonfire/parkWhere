<template>
  <div>
    <h1>Search Carpark</h1>
    <input type="text" v-model="user_search" />
    <p>{{ user_search }}</p>
    <div v-for="carpark in searchCarparks" :item="carpark" :key="carpark.ppCode">
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
    };
  },
  components: {
    CarparkCard,
  },
  computed: {
    searchCarparks() {
      let filtered_carparks = this.carparks;
      if (filtered_carparks) {
        filtered_carparks = filtered_carparks.filter((carpark) =>
          carpark.ppName.toLowerCase().includes(this.user_search)
        );
        console.log(filtered_carparks);
        return filtered_carparks;
      } else return null;
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
