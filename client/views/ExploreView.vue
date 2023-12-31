<script setup lang="ts">
import { defineProps, onBeforeMount, ref } from "vue";
import PostListComponent from "../components/Post/PostListComponent.vue";
import router from "../router";
import { useUserStore } from "../stores/user";
import { fetchy } from "../utils/fetchy";

const userStore = useUserStore();
const { currentUsername } = userStore;
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
    isLoadingWatch.value = false;
    return;
  }
  await getIsWatchingUser();
  isLoadingWatch.value = false;
};
const stopWatchingUser = async () => {
  isLoadingWatch.value = true;
  try {
    await fetchy(`/api/watch/${user.value._id}`, "DELETE");
    isLoadingWatch.value = false;
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
      <div v-if="currentUsername !== user.username">
        <v-btn v-if="isWatching" id="action-btn" @click="stopWatchingUser" :loading="isLoadingWatch" prepend-icon="mdi-bell-outline" rounded="xl" variant="text">Watching</v-btn>
        <v-btn v-else @click="watchUser" id="action-btn" :loading="isLoadingWatch" prepend-icon="mdi-bell-outline" rounded="xl" variant="text">Watch</v-btn>
      </div>
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
