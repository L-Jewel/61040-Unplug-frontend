<script setup lang="ts">
import QuietHourComponent from "@/components/Limit/QuietHourComponent.vue";
import { onBeforeMount, ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const loaded = ref(false);
let quietHours = ref([]);
const isCreating = ref(false);
const isLoading = ref(false);

const startTime = ref("");
const endTime = ref("");

async function getQuietHours() {
  try {
    const quietHoursResults = await fetchy(`/api/limits`, "GET");
    quietHours.value = quietHoursResults;
  } catch {
    return;
  }
}

async function createQuietHour(start: string, end: string) {
  isLoading.value = true;

  // Create Limit
  try {
    const [hourStart, minuteStart] = start.split(":");
    const [hourEnd, minuteEnd] = end.split(":");
    await fetchy("/api/limits", "POST", {
      body: {
        hourStart: parseInt(hourStart),
        minuteStart: parseInt(minuteStart),
        hourEnd: parseInt(hourEnd),
        minuteEnd: parseInt(minuteEnd),
      },
    });
  } catch {
    return;
  }
  isCreating.value = false;
  isLoading.value = false;
  await getQuietHours();
}

onBeforeMount(async () => {
  await getQuietHours();
  loaded.value = true;
});
</script>

<template>
  <section v-if="loaded">
    <article v-for="limit of quietHours" :key="limit">
      <QuietHourComponent :limit="limit" @refreshLimits="getQuietHours" />
    </article>
    <v-btn v-if="!isCreating" color="primary" @click="() => (isCreating = true)" id="form-submit" variant="tonal">Create a new quiet hour</v-btn>
  </section>
  <v-progress-linear v-else color="primary" indeterminate />
  <form v-if="isCreating" @submit.prevent="createQuietHour(startTime, endTime)">
    <label><strong>Create a new Quiet Hour:</strong></label>
    <div id="text-field-group">
      <v-text-field required type="time" label="Start Time" variant="outlined" v-model="startTime" />
      <v-text-field required type="time" label="End Time" variant="outlined" v-model="endTime" />
    </div>
    <v-btn :loading="isLoading" color="primary" type="submit" id="form-submit" variant="tonal">Create</v-btn>
  </form>
</template>

<style scoped>
#form-submit {
  margin-top: 0.5em;
}

#text-field-group {
  display: flex;
  gap: 1em;
  margin-top: 0.4em;
}
</style>
