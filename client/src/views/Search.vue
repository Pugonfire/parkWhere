<template>
  <div>
    <h1>Search</h1>
    <div class="Searchbar">
      <input type="text" name="userSearch" v-model="userSearch" placeholder="Enter name of carpark" />
      <button @click="search">Search</button>
    </div>
    <hr />
    <div class="carpark-container">
      <div class="carpark" v-for="carpark in carparks.data" :item="carpark" :key="carpark._id">
        <CarparkCard :carpark="carpark" />
      </div>
    </div>
  </div>
</template>

<script>
import CarparkCard from '../components/CarparkCard.vue';
import SearchService from '../SearchService.js';
export default {
  data() {
    return {
      userSearch: '',
      carparks: [],
    };
  },
  components: {
    CarparkCard,
  },
  methods: {
    async search() {
      this.carparks = await SearchService.search({
        ppName: this.userSearch,
      });
      console.log('Results returned');
      console.log(this.carparks);
    },
  },
};
</script>

<style scoped>
div.container {
  max-width: 800px;
  margin: 0 auto;
}

div.carpark-container {
  max-width: 500px;
  margin: 0 auto;
}
</style>
