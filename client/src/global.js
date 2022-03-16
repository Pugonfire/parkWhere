import { reactive } from 'vue';

const global = reactive({
  user_name: '',
  user_email: '',
  user_fav: [],
  user_history: [],
  loginStatus: false,
});

export default global;
