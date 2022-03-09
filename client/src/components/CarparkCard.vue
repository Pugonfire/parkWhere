<template>
  <div>
    <p class="ppName">{{ carpark.ppName }}</p>
    <p class="body">
      <b>Carpark Code:</b> {{ carpark.ppCode }}
      <br />
      <b>Vehicle Type:</b> {{ carpark.vehCat }}
      <br />
      <b>Weekday Rates:</b> {{ carpark.weekdayRate }} per {{ carpark.weekdayMin }} <br /><b>Saturday Rates:</b>
      {{ carpark.satdayRate }} per {{ carpark.satdayMin }} <br /><b>Sunday/Public Holiday Rates:</b>
      {{ carpark.sunPHRate }} per {{ carpark.sunPHMin }} <br /><b>Effective start to end of parking rate:</b>
      {{ carpark.startTime }} to
      {{ carpark.endTime }}
    </p>
  </div>
</template>

<script>
export default {
  props: {
    carpark: {},
  },
};
</script>

<style></style>
