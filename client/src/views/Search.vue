<template>
  <div v-if="card_clicked">
    <CarparkDetailsPopup :ppName="clicked_carpark_name" />
  </div>
  <div>
    <p class="parkTitle" v-show="!searched">Where would you like to park?</p>
    <div class="searchBarDiv">
      <input
        class="searchBar"
        type="text"
        name="userSearch"
        v-model="userSearch"
        placeholder="Search carparks..."
        v-on:keyup.enter="search"
      />
      <!-- <button @click="search">Search</button> -->
    </div>
    <br />
    <div v-if="emptyResults">Sorry, no results found.</div>
    <div v-if="!showRecent" class="carpark-container">
      <div class="carpark" v-for="carpark in carparks.data" :item="carpark" :key="carpark._id">
        <CarparkCard :carpark="carpark" @cardClicked="triggerDetails" />
      </div>
    </div>
    <div v-else class="carpark-container">
      <p class="recent">Recent Searches</p>
      <div class="carpark" v-for="carpark in recentCarparks.data" :item="carpark" :key="carpark._id">
        <CarparkCard :carpark="carpark" @cardClicked="triggerDetails" />
      </div>
    </div>
  </div>
</template>

<script>
import CarparkCard from '../components/CarparkCard.vue';
import CarparkDetailsPopup from '../components/CarparkDetailsPopup.vue';
import SearchService from '../SearchService.js';
import global from '../global';
export default {
  data() {
    return {
      userSearch: '',
      searched: false,
      carparks: [],
      recentCarparks: [],
      emptyResults: false,
      showRecent: true,
      card_clicked: false,
      clicked_carpark_name: '',
    };
  },
  components: {
    CarparkCard,
    CarparkDetailsPopup,
  },
  methods: {
    async search() {
      this.searched = true;
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
    triggerDetails(ppName) {
      this.clicked_carpark_name = ppName;
      this.card_clicked = true;
    },
  },
  created() {
    this.get_recent_carparks();
  },
};
</script>

<style scoped>
@import '../assets/main.css';

.parkTitle {
  padding-top: 15px;
}

.searchBar::placeholder {
  font-family: 'Montserrat', Arial, sans-serif;
  font-weight: 300;
}

.searchBar {
  font-family: 'Montserrat', Arial, sans-serif;
  font-weight: 400;
  padding-left: 15px;
  text-indent: 15px;
  box-shadow: 0px 10px 15px #3c82bb54;
  border: 0;
  outline: none;
}

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

input {
  width: 80vw;
  height: 3em;
}

hr {
  width: 80vw;
}
</style>
