<template>
  <div class="carpark_card_container">
    <div class="header_favButton">
      <FavButton class="favButton" :ppName="carpark.ppName" />
    </div>
    <div @click="click_card" class="content_right">
      <div v-if="carpark.lotsAvailable != null && carpark.lotsAvailable > 0">
        <div class="avail_carpark">{{ carpark.lotsAvailable }}/{{ carpark.parkCapacity }}</div>
        <div class="lot_caption">available lots</div>
      </div>
      <div v-else-if="carpark.lotsAvailable != null && carpark.lotsAvailable == 0">
        <div class="full_carpark">FULL</div>
      </div>
      <div v-else>
        <div class="no_details_carpark">{{ carpark.parkCapacity }}</div>
        <div class="lot_caption">total lots</div>
      </div>
    </div>
    <div @click="click_card" class="content_left">
      <p class="carparkName">
        {{ carpark.ppName }}
      </p>
      <p class="carparkCode">
        {{ carpark.ppCode }}
      </p>
    </div>
  </div>
</template>

<script>
import FavButton from './FavButton.vue';
import global from '../global';
import UserService from '../UserService';

export default {
  props: ['carpark'],
  data() {
    return {
      favourite: false,
    };
  },
  methods: {
    toggle_favourite() {
      this.favourite = !this.favourite;
    },
    click_card() {
      // update search history
      if (!global.user_history.includes(this.carpark.ppName)) {
        global.user_history.push(this.carpark.ppName);
        if (global.user_history.length > 10) global.user_history.shift();
      }
      UserService.updateUser(global.user_email, 'searchHistory', global.user_history);
      // trigger carpark details popup
      console.log(this.carpark.ppName);
      this.$emit('cardClicked', this.carpark.ppName);
      // this.$router.push({
      //   name: 'Details',
      //   params: {
      //     ppName: this.carpark.ppName,
      //   },
      // });
    },
  },
  components: {
    FavButton,
  },
};
</script>

<style scoped>
@import '../assets/main.css';

.carpark_card_container {
  position: relative;
  display: grid;
  grid-template-columns: 65fr 35fr;
  grid-template-rows: 15fr 85fr;
  background-color: white;
  box-shadow: 0px 10px 15px #3c82bb54;
  border-radius: 8px;
  padding: 10px 10px 20px 10px;
  margin: 0px 20px 30px 20px;
}

.header_favButton {
  grid-column-start: 1;
  grid-column-end: 3;
  grid-row-start: 1;
  grid-row-end: 2;
}

.content_right {
  grid-column-start: 2;
  grid-column-end: 3;
  grid-row-start: 2;
  grid-row-end: 3;
  text-align: center;
  align-self: center;
}

.content_left {
  grid-column-start: 1;
  grid-column-end: 2;
  grid-row-start: 2;
  grid-row-end: 3;
  text-align: center;
  padding: 0px 0px 0px 0px;
  margin: 0px 0px 0px 0px;
}

.carparkName {
  text-align: center;
  font-size: 22px;
  font-weight: 700;
  padding-bottom: 0px;
  margin-bottom: 0px;
}

.carparkCode {
  text-align: center;
  font-size: 22px;
  font-weight: 400;
  padding-bottom: 0px;
  margin-bottom: 0px;
}

.no_details_carpark {
  font-size: 30px;
  font-weight: 900;
  margin-bottom: 0;
}

.avail_carpark {
  font-size: 30px;
  font-weight: 900;
  margin-bottom: 0;
  color: #3c81bb;
}

.full_carpark {
  font-size: 30px;
  font-weight: 900;
  margin-bottom: 0;
  color: red;
}

.lot_caption {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 0;
}

.favButton {
  position: absolute;
  top: 20px;
  right: 20px;
}
</style>
