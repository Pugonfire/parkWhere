import axios from 'axios';

const endpoint = process.env.VUE_APP_API_URL;

export default {
  checkExist(input) {
    return axios.get(endpoint + '/api/users_manager/', { params: { id: input } });
  },
  createUser(email, username) {
    return axios.post(endpoint + '/api/users_manager/', { id: email, name: username });
  },
  updateUser(email, field, content) {
    return axios.post(endpoint + '/api/users_manager/update', {
      id: email,
      field: field,
      content: content,
    });
  },
};
