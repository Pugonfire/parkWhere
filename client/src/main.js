import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
//import GoogleSignInButton from 'vue-google-signin-button-directive';

const app = createApp(App);
app.use(router);
//app.use(GoogleSignInButton);
app.mount('#app');
