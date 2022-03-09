<template>
  <div>
    <h1>Search</h1>
    <div class="Searchbar">
      <input type="text" name="userSearch" v-model="userSearch" placeholder="Enter name of carpark" />
      <button @click="search">Search</button>
    </div>
    <hr />
    <div class="carpark-container">
      <div class="carpark" v-for="carpark in carparks.data" v-bind:item="carpark" v-bind:key="carpark._id">
        <CarparkCard :carpark="carpark" />
      </div>
    </div>
  </div>
</template>

<script>
import CarparkCard from '../components/CarparkCard.vue';
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
};
</script>

<style></style>
