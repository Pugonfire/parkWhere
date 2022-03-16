<template>
  <router-view />

  <div class="topnav">
    <h1>ParkNow</h1>
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
  color: #3c81bb;
}
.bot-nav-text {
  display: block;
  margin: 0 auto;
}
.topnav h1 {
  text-align: center;
  color: #fff;
  font-family: 'Comic Sans MS';
  margin: 0;
}
.topnav {
  background-color: rgb(24, 4, 82);
  overflow: hidden;
  position: fixed;
  top: 0;
  width: 100%;
  height: 50px;
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
  font-size: 40px;
  margin-right: 15px;
  padding: 5px;
}
</style>
