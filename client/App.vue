<script setup lang="ts">
import TimeCheckComponent from "@/components/Limit/TimeCheckComponent.vue";
import { useToastStore } from "@/stores/toast";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { computed, onBeforeMount, ref } from "vue";
import { RouterLink, RouterView, useRoute } from "vue-router";
import router from "./router";

const isLoading = ref(false);
const currentRoute = useRoute();
const currentRouteName = computed(() => currentRoute.name);
const userStore = useUserStore();
const { isLoggedIn, isUserLimited } = storeToRefs(userStore);
const { toast } = storeToRefs(useToastStore());

async function logout() {
  isLoading.value = true;
  await userStore.logoutUser();
  void router.push({ name: "Home" });
  isLoading.value = false;
}

// Make sure to update the session before mounting the app in case the user is already logged in
onBeforeMount(async () => {
  try {
    await userStore.updateSession();
  } catch {
    // User is not logged in
  }
});
</script>

<template>
  <div class="app-page">
    <header>
      <h1 v-if="isLoggedIn">{{ currentRouteName }}</h1>
      <div v-else class="title">
        <img src="@/assets/images/logo.svg" />
        <RouterLink :to="{ name: 'Home' }">
          <h1>Unplug</h1>
        </RouterLink>
      </div>
      <TimeCheckComponent v-if="isLoggedIn" />
      <v-btn v-if="isLoggedIn" @click="logout" :loading="isLoading" variant="tonal">Logout</v-btn>
      <RouterLink v-else :to="{ name: 'Login' }">
        <v-btn variant="tonal"> Login </v-btn>
      </RouterLink>
      <article v-if="toast !== null" class="toast" :class="toast.style">
        <p>{{ toast.message }}</p>
      </article>
    </header>
    <div class="site-body">
      <nav v-if="isLoggedIn && !isUserLimited">
        <ul>
          <li>
            <RouterLink :to="{ name: 'Nexus' }" :class="{ underline: currentRouteName == 'Nexus' }"> Nexus </RouterLink>
          </li>
          <li>
            <RouterLink :to="{ name: 'Search' }" :class="{ underline: currentRouteName == 'Search' }"> Search </RouterLink>
          </li>
          <li>
            <RouterLink :to="{ name: 'Screen Time Report' }" :class="{ underline: currentRouteName == 'Screen Time Report' }"> Screen Time Report </RouterLink>
          </li>
          <li>
            <RouterLink :to="{ name: 'Create Post' }" :class="{ underline: currentRouteName == 'Create Post' }"> Post </RouterLink>
          </li>
          <li>
            <RouterLink :to="{ name: 'Profile' }" :class="{ underline: currentRouteName == 'Profile' }"> Profile </RouterLink>
          </li>
          <li>
            <RouterLink :to="{ name: 'Settings' }" :class="{ underline: currentRouteName == 'Settings' }"> Settings </RouterLink>
          </li>
        </ul>
      </nav>
      <div class="site-view">
        <RouterView />
      </div>
    </div>
  </div>
</template>

<style scoped>
@import "./assets/toast.css";

.app-page {
  height: 100vh;
}

header {
  border-bottom: solid;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1em 2em;
}

nav {
  padding: 1em 2em;
  border-right: solid;
  height: 100%;
}

nav > ul {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

h1 {
  font-size: 2em;
  margin: 0;
}

.site-body {
  display: flex;
  height: 100%;
  width: 100%;
}

.site-view {
  width: 100%;
  height: 100%;
  overflow-y: scroll;
}

.title {
  display: flex;
  align-items: center;
  gap: 0.5em;
}

img {
  height: 2em;
}

a {
  font-size: large;
  color: black;
  text-decoration: none;
}

ul {
  list-style-type: none;
  margin-left: auto;
  display: flex;
  align-items: center;
  flex-direction: row;
  gap: 1em;
}

.underline {
  text-decoration: underline;
}
</style>
