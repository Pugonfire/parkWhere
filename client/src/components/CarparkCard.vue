<template>
  <div class="carpark">
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
  props: ['carpark'],
};
</script>

<style scoped>
p.error {
  border: 1px solid #ff5b5f;
  background-color: #ffc5c1;
  padding: 10px;
  margin-bottom: 15px;
}

div.carpark {
  position: relative;
  border: 1px solid #abc2e4;
  background-color: #a1bfec;
  padding: 10px 10px 30px 10px;
  margin-bottom: 15px;
}

p.ppName {
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 0;
}
p.ppName {
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 0;
}

p.body {
  text-align: left;
  font-size: 15px;
  font-weight: 500;
  margin-bottom: 0;
}
</style>
