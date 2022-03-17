import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import gAuthPlugin from 'vue3-google-oauth2';
import './assets/main.css';

let gAuth = {
  clientId: '637708357057-0j7h0dup0bj7h51cndme96lrne4fqmqb.apps.googleusercontent.com',
  scope: 'email',
  prompt: 'consent',
};

const app = createApp(App);
app.use(router);
app.use(gAuthPlugin, gAuth);
//app.use(GoogleSignInButton);
app.mount('#app');
