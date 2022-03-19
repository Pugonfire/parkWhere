<template>
  <div>
    <h1>Search</h1>
    <div class="Searchbar">
      <input type="text" name="userSearch" v-model="userSearch" placeholder="search carparks" />
      <button @click="search">Search</button>
    </div>
    <p>Where would you like to park?</p>
    <hr />
    <div v-if="emptyResults">Sorry, no results found.</div>
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
      emptyResults: false,
    };
  },
  components: {
    CarparkCard,
  },
  methods: {
    async search() {
      this.emptyResults = false;
      this.carparks = await SearchService.search({
        ppName: this.userSearch,
      });
      if (this.carparks.data.length === 0) {
        this.emptyResults = true;
      }
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
