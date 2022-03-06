<template>
  <router-view />
  <div id="container">
    <div id="bot-nav">
      <!-- To change to required routes -->
      <router-link :to="{ name: 'Home' }">
        <img src="./assets/favourites.png" class="bot-nav-icon" />
        <p class="bot-nav-text">Favourites</p></router-link
      >
      <!-- To change to required routes -->
      <router-link :to="{ name: 'Login' }"
        ><img src="./assets/map.png" class="bot-nav-icon" />
        <p class="bot-nav-text">Map</p></router-link
      >
      <!-- To change to required routes -->
      <router-link :to="{ name: 'ParkNow' }"
        ><img src="./assets/search.png" class="bot-nav-icon" />
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
  padding-top: 80px;
  position: fixed;
  z-index: 20;
}
#bot-nav {
  width: 100%;
  height: 10%;
  bottom: 0;
  position: fixed;
  display: flex;
  justify-content: space-around;
  border: 6px;
  border-top-style: groove;
  background-color: white;
}
#bot-nav a {
  font-weight: bold;
  font-family: 'Comic Sans MS';
  font-size: 4.5vw;
  color: #808080;
  padding: 10px;
  width: 100px;
  text-decoration: none;
  border-radius: 25px;
}
#bot-nav a.router-link-exact-active {
  background: #faf9f6;
  width: 100px;
}
img.bot-nav-icon {
  max-width: 50%;
  max-height: 50%;
  height: auto;
  width: auto;
}
p.bot-nav-text {
  display: block;
  margin: 0 auto;
}
</style>
