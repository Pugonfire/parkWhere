<template>
  <div class="Login">
    <div class = "CompanyIcon">
      <i class="fa-solid fa-car-side"></i>
    </div>
    <div class="CompanyName">
      <h1>ParkWhere</h1>
      <h3>Find your spot</h3>
    </div>
    <div>{{ msg }}</div>
    <br>
    <div class = "Name" v-if="global.user_name && global.loginStatus">Hello {{ global.user_name }}, welcome back!</div>
    Providing you with
    <div class="AppDescription">
      <br><i class="fa-regular fa-clock"></i> <span class="RealTime"> Real-time Updates</span><br/>
      <br><i class="fa-regular fa-compass"></i><span class="Parking"> Over 100 parking locations</span> <br/>
      <br><i class="fa-regular fa-heart"></i><span> Save your favourite spots</span> <br/>
    </div>
    <br>
    <LoginButton v-if="!global.loginStatus" />
    <button v-if = "global.loginStatus" @click="handleSignOut" :disabled="!global.loginStatus">Sign Out of Google</button>
  </div>
</template>

<script>
import { inject } from 'vue';
import global from '../global';
import LoginButton from '../components/GoogleLoginButton.vue';
export default {
  props: {
    msg: String,
  },
  components: {
    LoginButton,
  },
  data() {
    return {
      global,
    };
  },
  methods: {
    async handleSignOut() {
      try {
        await this.$gAuth.signOut();
        // console.log(this.$gAuth.signOut);
        global.user_name = '';
        global.loginStatus = false;
      } catch (error) {
        console.log(error);
      }
    },
  },
  setup() {
    const Vue3GoogleOauth = inject('Vue3GoogleOauth');
    return {
      Vue3GoogleOauth,
    };
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.CompanyIcon{
  font-size: 85px;
  margin-top: 100px;
  color: #414141;
  margin-bottom: -9px;
}
.CompanyName{
  margin: 0px 50px;
}
.CompanyName h1{
  background-color: #3c81bb;
  border-radius: 10px;
  color: rgb(255, 255, 255);
  text-align: center;
  padding: 4px;
  margin:0px;
  font-family: 'Montserrat';
  font-weight: bold;
}
.CompanyName h3{
  font-family: 'Pacifico';
  margin: 0px;
  font-weight: lighter;
}
.AppDescription{
  text-align: left;
  margin:0px 59px;
  padding-left: 17px;
}
.Start{
  text-align: center;
}
.Login button{
  display: inline-block;
  background: white;
  color: #444;
  width: 190px;
  border-radius: 5px;
  border: thin solid #888;
  box-shadow: 1px 1px 1px grey;
  white-space: nowrap;
  padding: 5px;
  font-family: 'Roboto';
}

</style>
