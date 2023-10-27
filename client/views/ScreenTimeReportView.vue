<script setup lang="ts">
import { CategoryScale, Chart as ChartJS, Legend, LineElement, LinearScale, PointElement, Title, Tooltip } from "chart.js";
import { onBeforeMount, ref } from "vue";
import { Line } from "vue-chartjs";
import { fetchy } from "../utils/fetchy";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

let loaded = ref(false);
const reportData = {
  labels: new Array<string>(),
  datasets: [
    {
      label: "Screen Time",
      backgroundColor: "#f87979",
      data: new Array<number>(),
    },
  ],
};

const getScreenTimeData = async () => {
  try {
    const screenTimeData = await fetchy(`/api/screenTime/data`, "GET");
    for (const data of screenTimeData) {
      reportData.labels.push(data.date.substr(0, data.date.indexOf("T")));
      reportData.datasets[0].data.push(data.screenTimeMins);
    }
  } catch {
    return;
  }
};

onBeforeMount(async () => {
  await getScreenTimeData();
  loaded.value = true;
});
</script>

<template>
  <main>
    <Line v-if="loaded" :data="reportData" />
    <v-progress-circular v-else color="primary" indeterminate />
  </main>
</template>

<style scoped>
main {
  padding: 1em 2em;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
