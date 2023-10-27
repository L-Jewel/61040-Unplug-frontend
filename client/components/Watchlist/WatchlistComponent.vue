<script setup lang="ts">
import { onBeforeMount, ref } from "vue";
import { fetchy } from "../../utils/fetchy";

let loaded = ref(false);
let watchlist = ref([]);

const getWatchlist = async () => {
  try {
    const watchlistResults = await fetchy("/api/watch", "GET");
    watchlist.value = watchlistResults;
  } catch {
    return;
  }
};

const stopWatchingUser = async (user: string) => {
  try {
    const watchedUser = await fetchy(`/api/users/${user}`, "GET");
    await fetchy(`/api/watch/${watchedUser._id}`, "DELETE");
  } catch {
    return;
  }
  await getWatchlist();
};

onBeforeMount(async () => {
  await getWatchlist();
  loaded.value = true;
});
</script>

<template>
  <div class="watchlist">
    <h1>Watchlist</h1>
    <div v-if="loaded">
      <div class="watched-user" v-for="watched in watchlist" :key="watched">
        <p>{{ watched }}</p>
        <v-btn icon="mdi-close" variant="text" size="small" @click="stopWatchingUser(watched)" />
      </div>
    </div>
    <v-progress-linear v-else color="primary" indeterminate />
  </div>
</template>

<style scoped>
.watchlist {
  border: solid;
  display: flex;
  flex-direction: column;
  margin: 1em 1em;
}

h1 {
  margin: 0.2em 0.5em;
}

.watched-user {
  padding: 0.5em 0.4em 0.5em 1em;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: solid;
}
</style>
