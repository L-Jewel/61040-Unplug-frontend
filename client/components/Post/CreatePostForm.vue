<script setup lang="ts">
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const content = ref("");
const tags = ref([]);
const emit = defineEmits(["refreshPosts"]);
const loading = ref(false);

const createPost = async (content: string, tags: string[]) => {
  loading.value = true;
  try {
    await fetchy("/api/posts", "POST", {
      body: { content, tags },
    });
  } catch (_) {
    return;
  }
  emit("refreshPosts");
  emptyForm();
  loading.value = false;
};

const emptyForm = () => {
  content.value = "";
  tags.value = [];
};
</script>

<template>
  <form @submit.prevent="createPost(content, tags)">
    <label for="content">Post Contents:</label>
    <textarea id="content" v-model="content" placeholder="Create a post!" required> </textarea>
    <v-combobox prepend-inner-icon="mdi-tag" v-model="tags" variant="outlined" multiple chips></v-combobox>
    <v-btn :loading="loading" variant="tonal" type="submit">Create Post</v-btn>
  </form>
</template>

<style scoped>
form {
  /* background-color: var(--base-bg); */
  border-radius: 1em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  padding: 1em;
  border: solid;
}

textarea {
  font-family: inherit;
  font-size: inherit;
  height: 6em;
  padding: 0.5em;
  border-radius: 4px;
  resize: none;
}

#content {
  border-style: solid;
}
</style>
