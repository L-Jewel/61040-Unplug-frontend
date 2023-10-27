<script setup lang="ts">
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const props = defineProps(["limit"]);
const emit = defineEmits(["refreshLimits"]);
const isEditing = ref(false);
const isLoadingEdit = ref(false);
const isLoadingDelete = ref(false);

const startTime = ref(`${props.limit.hourStart}:${props.limit.minuteStart}`);
const endTime = ref(`${props.limit.hourEnd}:${props.limit.minuteEnd}`);

async function deleteQuietHour() {
  isLoadingDelete.value = true;
  try {
    await fetchy(`/api/limits/${props.limit._id}`, "DELETE");
  } catch {
    return;
  }
  isLoadingDelete.value = false;
  emit("refreshLimits");
}

async function editQuietHour(start: string, end: string) {
  isLoadingEdit.value = true;
  try {
    const [hourStart, minuteStart] = start.split(":");
    const [hourEnd, minuteEnd] = end.split(":");
    await fetchy(`/api/limits/${props.limit._id}`, "PATCH", {
      body: {
        update: {
          hourStart: parseInt(hourStart),
          minuteStart: parseInt(minuteStart),
          hourEnd: parseInt(hourEnd),
          minuteEnd: parseInt(minuteEnd),
        },
      },
    });
  } catch {
    return;
  }
  isLoadingEdit.value = false;
  emit("refreshLimits");
}

function limitToString() {
  const startHour = props.limit.hourStart > 12 ? props.limit.hourStart - 12 : props.limit.hourStart === 0 ? 12 : props.limit.hourStart;
  const endHour = props.limit.hourEnd > 12 ? props.limit.hourEnd - 12 : props.limit.hourEnd === 0 ? 12 : props.limit.hourEnd;
  const startTimePeriod = props.limit.hourStart >= 12 ? "PM" : "AM";
  const endTimePeriod = props.limit.hourEnd >= 12 ? "PM" : "AM";
  return `${startHour}:${props.limit.minuteStart.toString().padStart(2, "0")} ${startTimePeriod} - ${endHour}:${props.limit.minuteEnd.toString().padStart(2, "0")} ${endTimePeriod}`;
}
</script>

<template>
  <div v-if="!isEditing" class="limit-entry">
    {{ limitToString() }}
    <div class="button-group">
      <v-btn :loading="isLoadingDelete" @click="deleteQuietHour()" size="x-small" variant="outlined" icon="mdi-trash-can" />
      <v-btn @click="() => (isEditing = true)" size="x-small" variant="outlined" icon="mdi-pencil" />
    </div>
  </div>
  <div v-else>
    <form @submit.prevent="editQuietHour(startTime, endTime)">
      <div id="text-field-group">
        <v-text-field type="time" label="Start Time" variant="outlined" v-model="startTime" />
        <v-text-field type="time" label="End Time" variant="outlined" v-model="endTime" />
      </div>
      <div class="button-group">
        <v-btn @click="() => (isEditing = false)" size="x-small" variant="outlined" icon="mdi-close" />
        <v-btn :loading="isLoadingEdit" type="submit" size="x-small" variant="outlined" icon="mdi-check" />
      </div>
    </form>
  </div>
</template>

<style scoped>
form {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.limit-entry {
  padding: 1em 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.button-group {
  display: flex;
  gap: 0.7em;
}

#text-field-group {
  display: flex;
  gap: 1em;
  margin-top: 0.4em;
  max-width: 100%;
}

#text-field-group > v-text-field {
  margin: 0;
}
</style>
