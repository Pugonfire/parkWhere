<template>
  <router-link :to="{ name: 'Login' }">login</router-link>
  <div v-if="global.loginStatus" class="loggedIn">
    <h1 class="loggedIn">{{ global.user_name }}'s Favourites</h1>
    <p class="loggedIn">search & add your favourite spots</p>
    <div v-for="carpark in favouriteCarparks.data" :item="carpark" :key="carpark._id">
      <CarparkCard :carpark="carpark" />
    </div>
  </div>
  <div v-else id="notLoggedIn">
    <h1>Favourites</h1>
    <p>Login and start saving your favorite spots!</p>
    <LoginButton @login-event="get_favourite_carparks" />
  </div>
</template>

<script>
import global from '../global';
import LoginButton from '../components/GoogleLoginButton.vue';
import CarparkCard from '../components/CarparkCard.vue';
import SearchService from '../SearchService.js';
export default {
  data() {
    return {
      global,
      favouriteCarparks: [],
    };
  },
  components: {
    LoginButton,
    CarparkCard,
  },
  methods: {
    async get_favourite_carparks() {
      this.favouriteCarparks = await SearchService.getCarparks({
        carparks: global.user_fav,
      });
      console.log(this.favouriteCarparks);
    },
  },
  created() {
    this.get_favourite_carparks();
  },
};
</script>

<style scoped>
#notLoggedIn {
  margin: 0 auto;
  padding-top: 30%;
  padding-bottom: 50%;
}
h1.loggedIn {
  text-align: left;
  padding-left: 5%;
  margin-bottom: 0;
}
p.loggedIn {
  margin-top: 0%;
  text-align: left;
  padding-left: 5%;
}
p {
  color: #3c81bb;
}
</style>
