<template>
  <div class="Login">
    <div>{{ msg }}</div>

    <div>Is Initialized: {{ Vue3GoogleOauth.isInit }}</div>
    <div>Is Authorized: {{ Vue3GoogleOauth.isAuthorized }}</div>
    <div v-if="global.user_name && global.loginStatus">Hello {{ global.user_name }}, welcome back!</div>
    <div v-else-if="!global.user_name && global.loginStatus">
      Welcome new user!<br />
      <input type="text" name="username" v-model="this.name" placeholder="What is your name?" />
      <button @click="createUserCollection()">Submit</button>
    </div>

    <LoginButton v-if="!global.loginStatus" />
    <br />
    <button @click="handleSignOut" :disabled="!global.loginStatus">Sign Out</button>
  </div>
</template>

<script>
import { inject } from 'vue';
import LoginService from '../LoginService.js';
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
      name: '',
      global,
    };
  },
  methods: {
    async handleSignIn() {
      try {
        const googleUser = await this.$gAuth.signIn();
        // console.log(this.$gAuth.signIn);
        if (!googleUser) {
          return null;
        }
        //this.user = googleUser.getBasicProfile().getEmail();
        global.user_email = googleUser.getBasicProfile().getEmail();
        LoginService.checkExist(global.user_email).then((response) => (global.user_name = response.data.name));
        global.loginStatus = true;
      } catch (error) {
        console.log(error);
        return null;
      }
    },
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
    createUserCollection() {
      global.user_name = this.name;
      LoginService.createUser(global.user_email, global.user_name);
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
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
