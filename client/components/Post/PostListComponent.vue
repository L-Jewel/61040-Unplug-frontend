<script setup lang="ts">
import EditPostForm from "@/components/Post/EditPostForm.vue";
import PostComponent from "@/components/Post/PostComponent.vue";
import { ref } from "vue";
import router from "../../router";
import { useUserStore } from "../../stores/user";

const props = defineProps(["posts"]);
const emit = defineEmits(["refreshPosts"]);
const postList = ref(props.posts);
const isLoading = ref(false);
let editing = ref("");

const userStore = useUserStore();

async function logout() {
  isLoading.value = true;
  await userStore.logoutUser();
  void router.push({ name: "Home" });
  isLoading.value = false;
}

function refreshPosts() {
  emit("refreshPosts");
}

function updateEditing(id: string) {
  editing.value = id;
}
</script>

<template>
  <section class="posts" v-if="props.posts.length !== 0">
    <article v-for="post in postList" :key="post._id">
      <PostComponent v-if="editing !== post._id" :post="post" @refresh="refreshPosts" @editPost="updateEditing" />
      <EditPostForm v-else :post="post" @editPost="updateEditing" />
    </article>
    <div class="prompt-unplug">
      <p>You're all caught up!</p>
      <v-btn @click="logout" color="primary" :loading="isLoading" variant="tonal">Unplug?</v-btn>
    </div>
  </section>
  <section v-else>
    <div class="prompt-unplug">
      <p>No posts to see here!</p>
      <v-btn @click="logout" color="primary" :loading="isLoading" variant="tonal">Unplug?</v-btn>
    </div>
  </section>
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

.prompt-unplug {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2em;
}

.prompt-unplug > p {
  margin: 0;
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
  padding: 0 1em;
}

.row {
  display: flex;
  justify-content: space-between;
  margin: 0 auto;
  max-width: 60em;
}
</style>
