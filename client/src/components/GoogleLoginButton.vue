<template>
  <button @click="SignIn"><i class="fa-brands fa-google"> </i>Sign in with Google</button>
</template>

<script>
import { inject } from 'vue';
import global from '../global';
import UserService from '../UserService.js';
export default {
  data() {
    return {
      global,
    };
  },
  methods: {
    async SignIn() {
      try {
        const googleUser = await this.$gAuth.signIn();
        // console.log(this.$gAuth.signIn);
        if (!googleUser) {
          return null;
        }
        //this.user = googleUser.getBasicProfile().getEmail();
        global.user_email = googleUser.getBasicProfile().getEmail();
        global.user_name = googleUser.getBasicProfile().getName();
        UserService.checkExist(global.user_email).then((response) => {
          if (response.data.id != global.user_email) UserService.createUser(global.user_email, global.user_name);
          else {
            global.user_fav = Object.values(response.data.favorites);
            console.log(Object.values(response.data.favorites));
            global.user_history = Object.values(response.data.searchHistory);
            console.log(Object.values(response.data.searchHistory));
          }
        });
        global.loginStatus = true;
      } catch (error) {
        console.log(error);
        return null;
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

<style scoped>
button {
  background-color: white;
  color: #808080;
  width: 45%;
  padding: 2%;
  border-radius: 6px;
  border-color: rgb(241, 240, 240);
}
i {
  background: conic-gradient(from -45deg, #ea4335 110deg, #4285f4 90deg 180deg, #34a853 180deg 270deg, #fbbc05 270deg)
    73% 55%/150% 150% no-repeat;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  -webkit-text-fill-color: transparent;
  margin-right: 5%;
}
</style>
