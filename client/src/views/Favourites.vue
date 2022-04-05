<template>
  <div class = "details" v-if="card_clicked">
    <div class = "back-button" @click = closeDetails> 
      <i class="fa-solid fa-arrow-left-long" ></i>
      <span class = "return">
          Return to Favourites
      </span>
    </div>
    <CarparkDetailsPopup :ppName="clicked_carpark_name" />
  </div>
  <div v-show="!card_clicked">
    <div v-if="global.loginStatus" class="loggedIn">
      <h1 class="loggedIn">{{ global.user_name }}'s Favourites</h1>
      <p class="loggedIn">search & add your favourite spots</p>
      <div v-for="carpark in favouriteCarparks.data" :item="carpark" :key="carpark._id">
        <CarparkCard :carpark="carpark" @cardClicked="triggerDetails" />
      </div>
    </div>
    <div v-else id="notLoggedIn">
      <h1>Favourites</h1>
      <p>Login and start saving your favorite spots!</p>
      <LoginButton @login-event="get_favourite_carparks" />
    </div>
  </div>
</template>

<script>
import global from '../global';
import LoginButton from '../components/GoogleLoginButton.vue';
import CarparkCard from '../components/CarparkCard.vue';
import CarparkDetailsPopup from '../components/CarparkDetailsPopup.vue';
import SearchService from '../SearchService.js';
export default {
  data() {
    return {
      global,
      favouriteCarparks: [],
      card_clicked: false,
      clicked_carpark_name: '',
    };
  },
  components: {
    LoginButton,
    CarparkCard,
    CarparkDetailsPopup,
  },
  methods: {
    async get_favourite_carparks() {
      this.favouriteCarparks = await SearchService.getCarparks({
        carparks: global.user_fav,
      });
      console.log(this.favouriteCarparks);
    },
    triggerDetails(ppName) {
      this.clicked_carpark_name = ppName;
      this.card_clicked = true;
    },
    closeDetails(){
      this.card_clicked = false;
    }
  },
  created() {
    this.get_favourite_carparks();
  },
};
</script>

<style scoped>
#notLoggedIn {
  margin: 0 auto;
  padding-top: 30%;
  padding-bottom: 50%;
}
h1.loggedIn {
  text-align: left;
  padding-left: 5%;
  margin-bottom: 0;
}
p.loggedIn {
  margin-top: 0%;
  text-align: left;
  padding-left: 5%;
}
p {
  color: #3c81bb;
}
.back-button{
  display: inline-block;
  padding: 10px 0;
  color: #3c81bb;
  font-weight: bold;
}
.details{
  text-align: left;
}
.fa-solid.fa-arrow-left-long{
  padding-left: 13px;
}
</style>
