<template>
  <button @click="toggleFav">
    <i class="fa-solid fa-heart" v-bind:style="[this.favorite ? { color: 'red' } : { color: 'white' }]"></i>
  </button>
</template>

<script>
import global from '../global';
import UserService from '../UserService';
export default {
  props: ['ppCode'],
  data() {
    return {
      favorite: false,
    };
  },
  mounted() {
    if (global.loginStatus) {
      this.favorite = global.user_fav.includes(this.ppCode);
      if (this.favorite) this.activeColor = 'red';
    } else {
      this.favorite = false;
    }
  },
  methods: {
    toggleFav() {
      if (global.loginStatus) {
        console.log(global.user_fav);
        // if it is currently a favorite
        if (this.favorite) {
          // remove ppCode from the global fav list
          global.user_fav = global.user_fav.filter((fav) => fav != this.ppCode);
        } else {
          // add ppCode to global fav list
          global.user_fav.push(this.ppCode);
        }
        // change color and whether this carpark if fav
        this.favorite = !this.favorite;
        // update database
        UserService.updateUser(global.user_email, 'favorites', global.user_fav);
        console.log(global.user_fav);
      }
    },
  },
};
</script>

<style scoped>
button {
  background-color: #3c81bb;
  border-radius: 6px;
  border-color: #808080;
}
i {
  outline-color: #3c81bb;
}
</style>
