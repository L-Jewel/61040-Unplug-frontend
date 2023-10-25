<script setup lang="ts">
import WatchlistComponent from "@/components/Watchlist/WatchlistComponent.vue";
import { onBeforeMount, ref } from "vue";
import { fetchy } from "../utils/fetchy";

let loaded = ref(false);
let posts = ref<Array<Record<string, string>>>([]);

async function getFeed() {
  let postResults;
  try {
    postResults = await fetchy("/api/feed", "GET");
  } catch (_) {
    console.log("error!");
    return;
  }
  posts.value = postResults;
}

onBeforeMount(async () => {
  await getFeed();
  console.log(posts.value);
  loaded.value = true;
});
</script>

<template>
  <main>
    <div class="nexus-feed"><PostListComponent v-if="loaded" :posts="posts" /></div>
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
}

main .nexus-watchlist {
  flex-basis: 33.33%;
}
</style>
