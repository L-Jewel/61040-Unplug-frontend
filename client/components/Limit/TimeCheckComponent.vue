<script setup lang="ts">
import { onBeforeMount, ref } from "vue";
import router from "../../router";
import { useUserStore } from "../../stores/user";
import { fetchy } from "../../utils/fetchy";

const { isFirstLimitReached, limitUser, isLoggedIn } = useUserStore();

const currentTime = ref("");
const nextLimitHour = ref();
const nextLimitMinute = ref();
const noLimits = ref(false);

function updateTime() {
  // Update clock component
  const currentDate = new Date();
  const currentHour = currentDate.getHours();
  const currentMinute = currentDate.getMinutes().toString().padStart(2, "0");
  const currentHour12 = currentHour > 12 ? currentHour - 12 : currentHour === 0 ? 12 : currentHour;
  const timePeriod = currentDate.getHours() >= 12 ? "PM" : "AM";
  currentTime.value = `${currentHour12}:${currentMinute} ${timePeriod}`;

  // Check if a limit has been reached
  if (!noLimits.value && !isFirstLimitReached && (currentHour > nextLimitHour.value || (currentHour === nextLimitHour.value && currentMinute >= nextLimitMinute.value))) {
    console.log("first limit reached!", isFirstLimitReached);
    console.log("time check limit");
    limitUser();
    void router.push({ name: "Limit" });
  }
}

async function getNextLimit() {
  try {
    const nextLimit = await fetchy(`/api/limits/next`, "GET");
    if (nextLimit.hour && nextLimit.minute) {
      nextLimitHour.value = nextLimit.hour;
      nextLimitMinute.value = nextLimit.minute;
    } else {
      noLimits.value = true;
    }
  } catch {
    return;
  }
}

setInterval(() => {
  if (isLoggedIn) {
    updateTime();
  }
}, 1000);

onBeforeMount(async () => {
  updateTime();
  await getNextLimit();
});
</script>

<template>
  <div class="time-check" :class="{ elapsed: isFirstLimitReached }" @refreshLimits="getNextLimit">
    {{ currentTime }}
    <v-icon v-if="isFirstLimitReached" size="x-small" icon="mdi-timer-alert" />
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
