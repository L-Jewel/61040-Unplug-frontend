<script setup lang="ts">
import { ref } from "vue";
import router from "../router";
import { useUserStore } from "../stores/user";

const isLoadingLogout = ref(false);
const isLoadingOverride = ref(false);

const userStore = useUserStore();

async function logout() {
  isLoadingLogout.value = true;
  await userStore.logoutUser();
  void router.push({ name: "Home" });
  isLoadingLogout.value = false;
}

async function override() {
  isLoadingOverride.value = true;
  await userStore.overrideLimit();
  void router.push({ name: "Nexus" });
  isLoadingOverride.value = false;
}
</script>

<template>
  <main>
    <div>
      <h1>Time to Unplug!</h1>
      <p>Now is an excellent time to unwind, go for a walk, or meet up with a friend.</p>
    </div>
    <div id="limit-btn-group">
      <v-btn @click="logout" id="unplug-btn" color="primary" variant="tonal" :loading="isLoadingLogout" prepend-icon="mdi-power-plug">Unplug</v-btn>
      <v-btn @click="override" id="delete-btn" variant="text" :loading="isLoadingOverride" prepend-icon="mdi-link-variant">Override Limit</v-btn>
    </div>
  </main>
</template>

<style scoped>
main {
  padding: 0 1em;
  display: flex;
  flex-direction: column;
  gap: 30%;
  /* justify-content: space-between; */
  height: 100%;
}

#unplug-btn {
  font-weight: bold;
}

#limit-btn-group {
  margin: 1em 0;
  display: flex;
  gap: 1em;
}
</style>
