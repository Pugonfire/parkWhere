import axios from 'axios';

export default {
  checkExist(input) {
    return axios.get('http://localhost:5000/api/users_manager/', { params: { id: input } });
  },
  createUser(email, username) {
    return axios.post('http://localhost:5000/api/users_manager/', { id: email, name: username });
  },
  updateUser(email, field, content) {
    return axios.post('http://localhost:5000/api/users_manager/update', {
      id: email,
      field: field,
      content: content,
    });
  },
};
