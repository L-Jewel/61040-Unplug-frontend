<script setup lang="ts">
import { defineProps, onBeforeMount, ref } from "vue";
import PostListComponent from "../components/Post/PostListComponent.vue";
import router from "../router";
import { fetchy } from "../utils/fetchy";

const props = defineProps(["username"]);
const user = ref();
const loaded = ref(false);
const isWatching = ref(false);
let posts = ref<Array<Record<string, string>>>([]);
const isLoadingWatch = ref(false);

async function getPosts() {
  let postResults;
  try {
    postResults = await fetchy("/api/posts", "GET", { query: { author: props.username } });
  } catch (_) {
    return;
  }
  posts.value = postResults;
}
const getUser = async () => {
  try {
    const userResult = await fetchy(`/api/users/${props.username}`, "GET");
    user.value = userResult;
  } catch (_) {
    void router.push({ name: "Search" });
    return;
  }
};
const watchUser = async () => {
  isLoadingWatch.value = true;
  try {
    await fetchy(`/api/watch`, "POST", { body: { watched_id: user.value._id } });
  } catch {
    return;
  }
  await getIsWatchingUser();
  isLoadingWatch.value = false;
};
const stopWatchingUser = async () => {
  isLoadingWatch.value = true;
  try {
    await fetchy(`/api/watch/${user.value._id}`, "DELETE");
  } catch {
    return;
  }
  await getIsWatchingUser();
  isLoadingWatch.value = false;
};
const getIsWatchingUser = async () => {
  try {
    const isWatchingResult = await fetchy(`/api/watch/${user.value._id}`, "GET");
    isWatching.value = isWatchingResult;
  } catch {
    return;
  }
};

onBeforeMount(async () => {
  await getUser();
  await getIsWatchingUser();
  await getPosts();
  loaded.value = true;
});
</script>

<template>
  <main v-if="loaded">
    <div class="account-header">
      <h1>{{ user.username }}</h1>
      <v-btn v-if="isWatching" @click="stopWatchingUser" :loading="isLoadingWatch" prepend-icon="mdi-bell-outline" rounded="xl" variant="tonal">Watching</v-btn>
      <v-btn v-else @click="watchUser" :loading="isLoadingWatch" prepend-icon="mdi-bell-outline" rounded="xl" variant="tonal">Watch</v-btn>
    </div>
    <PostListComponent :posts="posts" />
  </main>
  <div v-else class="page-load">
    <v-progress-circular color="primary" indeterminate />
  </div>
</template>

<style scoped>
main {
  padding: 0 1em;
}

.account-header {
  display: flex;
  gap: 1em;
  align-items: center;
}

.page-load {
  display: flex;
  justify-content: center;
  padding: 1em;
}
</style>
