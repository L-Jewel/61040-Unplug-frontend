<script setup lang="ts">
import EditPostForm from "@/components/Post/EditPostForm.vue";
import PostComponent from "@/components/Post/PostComponent.vue";
import { ref } from "vue";

// const loaded = ref(false);
const props = defineProps(["posts"]);
// let posts = ref<Array<Record<string, string>>>([]);
let editing = ref("");
// let searchAuthor = ref("");

// async function getPosts(author?: string) {
//   let query: Record<string, string> = author !== undefined ? { author } : {};
//   let postResults;
//   try {
//     postResults = await fetchy("/api/posts", "GET", { query });
//   } catch (_) {
//     return;
//   }
//   searchAuthor.value = author ? author : "";
//   posts.value = postResults;
// }

function updateEditing(id: string) {
  editing.value = id;
}

// onBeforeMount(async () => {
//   await getPosts();
//   loaded.value = true;
// });
</script>

<template>
  <!-- <section v-if="isLoggedIn">
    <h2>Create a post:</h2>
    <CreatePostForm @refreshPosts="getPosts" />
  </section> -->
  <!-- <div class="row">
    <h2 v-if="!searchAuthor">Posts:</h2>
    <h2 v-else>Posts by {{ searchAuthor }}:</h2>
    <SearchPostForm @getPostsByAuthor="getPosts" />
  </div> -->
  <section class="posts" v-if="props.posts.length !== 0">
    <article v-for="post in props.posts" :key="post._id">
      <PostComponent v-if="editing !== post._id" :post="post" @editPost="updateEditing" />
      <EditPostForm v-else :post="post" @editPost="updateEditing" />
    </article>
  </section>
  <p v-else>No posts found</p>
</template>

<style scoped>
section {
  display: flex;
  flex-direction: column;
  gap: 1em;
}

section,
p,
.row {
  margin: 0 auto;
  max-width: 60em;
}

article {
  /* background-color: var(--base-bg); */
  border-style: solid;
  /* border-radius: 1em; */
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  padding: 1em;
}

.posts {
  padding: 1em;
}

.row {
  display: flex;
  justify-content: space-between;
  margin: 0 auto;
  max-width: 60em;
}
</style>
