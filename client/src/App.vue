<template>
  <router-view />

  <div class="topnav">
    <h1>ParkWhere</h1>
    <div id="moreOptions">
      <router-link :to="{ name: 'ParkNow' }">
        <i class="fa-solid fa-bars"></i>
      </router-link>
    </div>
  </div>
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
body {
  margin: 0;
}

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 75px;
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
  font-size: 16px;
  color: #808080;
  padding: 10px;
  width: 100vw;
  text-decoration: none;
  border-radius: 25px;
}

#bot-nav i {
  font-size: 20px;
}

#bot-nav a.router-link-exact-active i {
  color: #3c81bb;
  font-size: 25px;
}
.bot-nav-text {
  display: block;
  margin: 0 auto;
}
.topnav h1 {
  text-align: center;
  color: #fff;
  margin: 0;
  margin-top: 16px;
}
.topnav {
  background-color: #3c81bb;
  overflow: hidden;
  position: fixed;
  top: 0;
  width: 100%;
  height: 70px;
}

#moreOptions {
  display: flex;
  align-items: center;
  flex-direction: row-reverse;
  position: fixed;
  top: 0;
  width: 100%;
}

.fa-solid.fa-bars {
  color: #fff;
  font-size: 35px;
  margin-right: 15px;
  margin-top: 17px;
}
</style>
