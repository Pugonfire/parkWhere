<template>
  <router-link :to="{ name: 'Login' }">login</router-link>
  <div v-if="global.loginStatus" class="loggedIn">
    <h1 class="loggedIn">{{ global.user_name }}'s Favourites</h1>
    <p class="loggedIn">search & add your favourite spots</p>
  </div>
  <div v-else id="notLoggedIn">
    <h1>Favourites</h1>
    <p>Login and start saving your favorite spots!</p>
    <LoginButton />
  </div>
</template>

<script>
import global from '../global';
import LoginButton from '../components/GoogleLoginButton.vue';
export default {
  data() {
    return {
      global,
    };
  },
  components: {
    LoginButton,
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
