<script setup lang="ts">
import { computed, onBeforeMount, ref } from "vue";
import { useRoute } from "vue-router";
import router from "../../router";
import { useUserStore } from "../../stores/user";
import { fetchy } from "../../utils/fetchy";

const { limitUser, isLoggedIn } = useUserStore();

const currentTime = ref("");
const nextLimitHourStart = ref();
const nextLimitMinuteStart = ref();
const nextLimitHourEnd = ref();
const nextLimitMinuteEnd = ref();
const noLimits = ref(false);

const currentRoute = useRoute();
const currentRouteName = computed(() => currentRoute.name);

const firstLimitReached = ref(false);

async function updateTime() {
  // Update clock component
  const currentDate = new Date();
  const currentHour = currentDate.getHours();
  const currentMinute = currentDate.getMinutes().toString().padStart(2, "0");
  const currentHour12 = currentHour > 12 ? currentHour - 12 : currentHour === 0 ? 12 : currentHour;
  const timePeriod = currentDate.getHours() >= 12 ? "PM" : "AM";
  currentTime.value = `${currentHour12}:${currentMinute} ${timePeriod}`;

  // Check if a limit has been reached
  if (currentRouteName.value !== "Limit" && !noLimits.value && !firstLimitReached.value && isLimitReached(currentHour, currentDate.getMinutes())) {
    limitUser();
    firstLimitReached.value = true;
    void router.push({ name: "Limit" });
    await getNextLimit();
  }
}

function isLimitReached(currentHour: number, currentMinute: number) {
  const pastLimitStart = currentHour > nextLimitHourStart.value || (currentHour === nextLimitHourStart.value && currentMinute >= nextLimitMinuteStart.value);
  const beforeLimitEnd = currentHour < nextLimitHourEnd.value || (currentHour === nextLimitHourEnd.value && currentMinute < nextLimitMinuteEnd.value);
  const limitWraps = nextLimitHourEnd.value > nextLimitHourStart.value || (nextLimitHourEnd.value === nextLimitHourStart.value && nextLimitMinuteStart.value >= nextLimitMinuteEnd.value);

  return pastLimitStart && (limitWraps || beforeLimitEnd);
}

async function getNextLimit() {
  try {
    const nextLimit = await fetchy(`/api/limits/next`, "GET");
    if (nextLimit.hourStart !== null && nextLimit.hourEnd !== null && nextLimit.minuteStart !== null && nextLimit.minuteEnd !== null) {
      nextLimitHourStart.value = nextLimit.hourStart;
      nextLimitMinuteStart.value = nextLimit.minuteStart;
      nextLimitHourEnd.value = nextLimit.hourEnd;
      nextLimitMinuteEnd.value = nextLimit.minuteEnd;
    } else {
      noLimits.value = true;
    }
  } catch {
    return;
  }
}

setInterval(async () => {
  if (isLoggedIn) {
    await updateTime();
  }
}, 5000);

setInterval(async () => {
  if (isLoggedIn) {
    await getNextLimit();
  }
}, 10000);

onBeforeMount(async () => {
  await updateTime();
  await getNextLimit();
});
</script>

<template>
  <div class="time-check" :class="{ elapsed: firstLimitReached }">
    {{ currentTime }}
    <v-icon v-if="firstLimitReached" size="x-small" icon="mdi-timer-alert" />
  </div>
</template>

<style scoped>
.time-check {
  font-size: 1.7em;
  border: solid;
  padding: 0 0.5em;
  border-radius: 1em;
  display: flex;
  align-items: center;
  gap: 0.5em;
}

.elapsed {
  color: darkred;
}
</style>
