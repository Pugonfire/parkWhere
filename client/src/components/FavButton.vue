<template>
  <i class="fas fa-heart" @click="toggleFav" v-bind:style="[this.favorite ? { color: 'red' } : { color: 'grey' }]"></i>
</template>

<script>
import global from '../global';
import UserService from '../UserService';
export default {
  props: ['ppName'],
  data() {
    return {
      favorite: false,
    };
  },
  mounted() {
    if (global.loginStatus) {
      this.favorite = global.user_fav.includes(this.ppName);
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
          // remove ppName from the global fav list
          global.user_fav = global.user_fav.filter((fav) => fav != this.ppName);
        } else {
          // add ppName to global fav list
          global.user_fav.push(this.ppName);
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
i {
  font-size: 30px;
}
</style>
