<template>
  <div class="Login">
    <div>{{ msg }}</div>
    <div v-if="global.user_name && global.loginStatus">Hello {{ global.user_name }}, welcome back!</div>
    <LoginButton v-if="!global.loginStatus" />
    <br />
    <button @click="handleSignOut" :disabled="!global.loginStatus">Sign Out</button>
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
