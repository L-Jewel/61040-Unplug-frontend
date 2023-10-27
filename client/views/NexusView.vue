<script setup lang="ts">
import PostListComponent from "@/components/Post/PostListComponent.vue";
import WatchlistComponent from "@/components/Watchlist/WatchlistComponent.vue";
import { onBeforeMount, ref } from "vue";
import { fetchy } from "../utils/fetchy";

let loaded = ref(false);
let posts = ref([]);

async function getFeed() {
  let postResults;
  try {
    postResults = await fetchy("/api/feed", "GET");
  } catch (_) {
    return;
  }
  posts.value = postResults;
}

onBeforeMount(async () => {
  await getFeed();
  loaded.value = true;
});
</script>

<template>
  <main>
    <div class="nexus-feed">
      <PostListComponent v-if="loaded" :posts="posts" />
      <v-progress-circular v-else color="primary" indeterminate />
    </div>
    <div class="nexus-watchlist">
      <WatchlistComponent />
    </div>
  </main>
</template>

<style scoped>
main {
  display: flex;
  width: 100%;
}

main .nexus-feed {
  flex-basis: 66.66%;
  display: flex;
  /* align-items: center; */
  margin: 1em 0;
  justify-content: center;
}

main .nexus-watchlist {
  flex-basis: 33.33%;
}
</style>
