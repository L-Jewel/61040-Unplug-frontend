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
  await getTags();
};

const deleteTag = async (tag: string) => {
  console.log(tag, `/tags/${tag}/${props.post._id}`);
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
      <button v-if="props.post.author == currentUsername" @click="deleteTag(tag)" class="btn-icon pure-button">x</button>
    </article>
    <button class="btn-small pure-button" @click="startEditing" v-if="props.post.author == currentUsername && !addingTag">+</button>
    <input v-if="addingTag" v-model="tagToAdd" />
    <button class="btn-small pure-button" @click="addTag" v-if="addingTag">Add Tag</button>
  </section>
</template>

<style scoped>
section {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}
article {
  display: flex;
  border: solid;
  gap: 0.5rem;
  border-radius: 2rem;
  padding: 0rem 0.75rem;
}
</style>
