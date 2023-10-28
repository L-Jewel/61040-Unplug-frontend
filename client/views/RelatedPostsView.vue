<script setup lang="ts">
import { ObjectId } from "mongodb";
import { onBeforeMount, ref } from "vue";
import PostListComponent from "../components/Post/PostListComponent.vue";
import { fetchy } from "../utils/fetchy";

const props = defineProps(["post"]);
const loaded = ref(false);

let relatedPosts = ref<ObjectId[]>([]);

async function getRelatedPosts() {
  let relatedPostsIDs: ObjectId[] = [];
  const tags = await getTags();

  for (const tag of tags) {
    if (relatedPostsIDs.length > 10) break;
    const taggedPosts = await getPostsWithTag(tag);
    relatedPostsIDs = relatedPostsIDs.concat(taggedPosts);
  }
  const relatedPostsList = [];
  const relatedPostsSet = new Set<string>();
  for (const relatedPost of relatedPostsIDs) {
    try {
      const postResult = await fetchy(`/api/posts/${relatedPost}`, "GET");
      // Prevent duplicates
      if (!relatedPostsSet.has(postResult._id) && postResult._id !== props.post) {
        relatedPostsList.push(postResult);
        relatedPostsSet.add(postResult._id);
      }
      // Caps the related content list
      if (relatedPostsList.length >= 10) {
        break;
      }
    } catch {
      continue;
    }
  }
  relatedPosts.value = relatedPostsList;
  return;
}

async function getPostsWithTag(tag: string): Promise<ObjectId[]> {
  try {
    return await fetchy(`/api/tags/${tag}`, "GET");
  } catch {
    return [];
  }
}
async function getTags(): Promise<string[]> {
  try {
    return await fetchy(`/api/posts/${props.post}/tags`, "GET");
  } catch (_) {
    return [];
  }
}

onBeforeMount(async () => {
  await getRelatedPosts();
  loaded.value = true;
});
</script>

<template>
  <main v-if="loaded">
    <PostListComponent :posts="relatedPosts" />
  </main>
  <div v-else class="loading">
    <v-progress-circular color="primary" indeterminate />
  </div>
</template>

<style scoped>
main {
  padding: 1em 0;
}
.loading {
  display: flex;
  padding: 1em;
  justify-content: center;
}
</style>
