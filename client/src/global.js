import { reactive } from 'vue';

const global = reactive({
  user_name: '',
  user_email: '',
  loginStatus: false,
});

export default global;
