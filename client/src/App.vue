<template>
  <router-view />
  <div id="container">
    <div id="bot-nav">
      <!-- To change to required routes -->
      <router-link :to="{ name: 'Favourites' }">
        <i class="fa-regular fa-heart"></i>
        <p class="bot-nav-text">Favourites</p></router-link
      >
      <!-- To change to required routes -->
      <router-link :to="{ name: 'ParkNow' }">
        <i class="fa-regular fa-map"></i>
        <p class="bot-nav-text">Map</p></router-link
      >
      <!-- To change to required routes -->
      <router-link :to="{ name: 'Search' }">
        <i class="fa-solid fa-magnifying-glass"></i>
        <p class="bot-nav-text">Search</p></router-link
      >
    </div>
  </div>
</template>

<script>
export default {
  name: 'App',
  components: {},
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
#container {
  height: 75px;
  width: 100%;
}
#bot-nav {
  width: 100%;
  bottom: 0;
  position: fixed;
  display: flex;
  border: 6px;
  border-top-style: groove;
  background-color: white;
}
#bot-nav a {
  font-weight: bold;
  font-family: 'Comic Sans MS';
  font-size: 5vw;
  color: #808080;
  padding: 10px;
  width: 100vw;
  text-decoration: none;
  border-radius: 25px;
}
#bot-nav a.router-link-exact-active {
  background: #ebeaea;
  width: 100vw;
}
#bot-nav a.router-link-exact-active i {
  color: dodgerblue;
}
.bot-nav-text {
  display: block;
  margin: 0 auto;
}
</style>
