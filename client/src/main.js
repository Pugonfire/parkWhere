import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import gAuthPlugin from 'vue3-google-oauth2';
import './assets/main.css';

const { googleAuthClientID } = require('../../config');

let gAuth = {
  clientId: googleAuthClientID,
  scope: 'email',
  prompt: 'consent',
};

const app = createApp(App);
app.use(router);
app.use(gAuthPlugin, gAuth);
//app.use(GoogleSignInButton);
app.mount('#app');
