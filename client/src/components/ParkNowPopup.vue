<template>
  <div class="popup_card">
    <p v-if="found">Carpark found within</p>
    <p v-else>Searching for carparks within</p>
    <i v-if="found && !searching" class="fa-solid fa-check fa-2xl"></i>
    <i v-else-if="!found && !searching" class="fa-solid fa-xmark fa-2xl"></i>
    <i v-else class="fas fa-spinner fa-spin fa-2xl"></i>
    <p>{{ distance }} meters</p>
  </div>
</template>

<script>
export default {
  props: ['distance', 'found', 'searching'],
  data() {
    return {
      statusText: 'Searching for carparks within',
    };
  },
};
</script>

<style>
div.popup_card {
  border: 2px solid black;
  padding: 0px 0px 0px 0px;
  margin: 0px 0px 0px 0px;
}
i.fa-check {
  color: green;
}
i.fa-xmark {
  color: red;
}
i.fa-spinner {
  color: blue;
}
</style>
