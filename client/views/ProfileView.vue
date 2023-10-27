<script setup lang="ts">
import PostListComponent from "@/components/Post/PostListComponent.vue";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import { fetchy } from "../utils/fetchy";

const { currentUsername } = storeToRefs(useUserStore());

let loaded = ref(false);
let posts = ref<Array<Record<string, string>>>([]);

async function getPosts() {
  loaded.value = false;
  let postResults;
  try {
    postResults = await fetchy("/api/posts", "GET", { query: { author: currentUsername.value } });
  } catch (_) {
    return;
  }
  posts.value = postResults;
  loaded.value = true;
}

onBeforeMount(async () => {
  await getPosts();
  loaded.value = true;
});
</script>

<template>
  <main>
    <PostListComponent v-if="loaded" :posts="posts" @refreshPosts="getPosts" />
    <v-progress-circular v-else color="primary" indeterminate />
  </main>
</template>

<style scoped>
main {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1em 0;
  /* justify-content: stretch; */
}
</style>
