<template>
  <div>
    <h1>{{ carpark.ppName }}</h1>
    <h3>{{ carpark.ppCode }}</h3>
    <p>{{ carpark.startTime }} to {{ carpark.endTime }}</p>
    <p>{{ carpark.weekdayMin }} for {{ carpark.weekdayRate }}</p>
  </div>
</template>

<script>
export default {
  props: ['carpark'],
};
</script>

<style></style>
