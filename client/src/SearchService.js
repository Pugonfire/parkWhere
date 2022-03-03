import Api from './Api';

export default {
  search(input) {
    return Api().post('search', input);
  },
};
