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
    <div v-if="!showRecent" class="carpark-container">
      <div class="carpark" v-for="carpark in carparks.data" :item="carpark" :key="carpark._id">
        <CarparkCard :carpark="carpark" />
      </div>
    </div>
    <div v-else class="carpark-container">
      <p class="recent">Recent Searches</p>
      <div class="carpark" v-for="carpark in recentCarparks.data" :item="carpark" :key="carpark._id">
        <CarparkCard :carpark="carpark" />
      </div>
    </div>
  </div>
</template>

<script>
import CarparkCard from '../components/CarparkCard.vue';
import SearchService from '../SearchService.js';
import global from '../global';
export default {
  data() {
    return {
      userSearch: '',
      carparks: [],
      recentCarparks: [],
      emptyResults: false,
      showRecent: true,
    };
  },
  components: {
    CarparkCard,
  },
  methods: {
    async search() {
      this.emptyResults = false;
      this.showRecent = false;
      this.carparks = await SearchService.search({
        ppName: this.userSearch,
      });
      if (this.carparks.data.length === 0) {
        this.emptyResults = true;
      }
      console.log('Results returned');
      console.log(this.carparks);
    },
    async get_recent_carparks() {
      this.recentCarparks = await SearchService.getCarparks({
        carparks: global.user_history,
      });
      console.log(this.recentCarparks);
    },
  },
  created() {
    this.get_recent_carparks();
  },
};
</script>

<style scoped>
@import '../assets/main.css';

div.container {
  max-width: 800px;
  margin: 0 auto;
}

div.carpark-container {
  max-width: 500px;
  margin: 0 auto;
}

p.recent {
  text-align: left;
  margin-left: 20px;
}
</style>
