<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import { fetchy } from "../../utils/fetchy";
const { currentUsername } = storeToRefs(useUserStore());

const props = defineProps(["post"]);
let addingTag = ref(false);
const tagToAdd = ref("");
let tags = ref([]);
let loaded = ref(false);

async function getTags() {
  let tagResults;
  try {
    tagResults = await fetchy(`/api/posts/${props.post._id}/tags`, "GET");
  } catch (_) {
    return;
  }
  tags.value = tagResults;
}

const startEditing = () => {
  addingTag.value = true;
};

const addTag = async () => {
  try {
    await fetchy("/api/tags", "POST", {
      body: { _id: props.post._id, tag: tagToAdd.value },
    });
  } catch (_) {
    console.log("error", _);
    return;
  }
  addingTag.value = false;
  tagToAdd.value = "";
  await getTags();
};

const deleteTag = async (tag: string) => {
  try {
    await fetchy(`api/tags/${tag}/${props.post._id}`, "DELETE");
  } catch (_) {
    console.log("error", _);
    return;
  }
  addingTag.value = false;
  await getTags();
};

onBeforeMount(async () => {
  await getTags();
  loaded.value = true;
});
</script>

<template>
  <section v-if="loaded">
    <article v-for="tag in tags" :key="tag">
      #{{ tag }}
      <v-btn icon="mdi-close" size="x-small" variant="text" v-if="props.post.author == currentUsername" @click="deleteTag(tag)" class="btn-icon pure-button" />
    </article>
    <v-btn icon="mdi-plus" size="x-small" variant="outlined" @click="startEditing" v-if="props.post.author == currentUsername && !addingTag" />
    <input v-if="addingTag" v-model="tagToAdd" />
    <button class="btn-small pure-button" id="action-btn" @click="addTag" v-if="addingTag">Add Tag</button>
  </section>
  <v-progress-linear v-else color="primary" indeterminate />
</template>

<style scoped>
section {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  align-items: center;
}
article {
  display: flex;
  align-items: center;
  border: solid;
  gap: 0.5rem;
  border-radius: 2rem;
  padding: 0rem 0.75rem;
}
input {
  border: solid 0.1em;
}
</style>
