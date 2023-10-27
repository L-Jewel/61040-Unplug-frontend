<script setup lang="ts">
import TagListComponent from "@/components/Tag/TagListComponent.vue";
import { useUserStore } from "@/stores/user";
import { formatDate } from "@/utils/formatDate";
import { storeToRefs } from "pinia";
import { ref } from "vue";
import { useRoute } from "vue-router";
import router from "../../router";
import { fetchy } from "../../utils/fetchy";

const props = defineProps(["post"]);
const emit = defineEmits(["editPost", "refresh"]);
const { currentUsername } = storeToRefs(useUserStore());
const isLoadingDelete = ref(false);

const currentRoute = useRoute();

const deletePost = async () => {
  isLoadingDelete.value = true;
  try {
    await fetchy(`/api/posts/${props.post._id}`, "DELETE");
  } catch {
    return;
  }
  isLoadingDelete.value = false;
  emit("refresh");
};

const viewRelatedPosts = async () => {
  void router.push({ name: "Related Posts", params: { post: props.post._id } });
};
</script>

<template>
  <div class="post-box">
    <div class="titlebar">
      <p class="author">{{ props.post.author }}</p>
      <menu v-if="props.post.author == currentUsername">
        <li><v-btn prepend-icon="mdi-pencil" size="small" variant="tonal" @click="emit('editPost', props.post._id)">Edit</v-btn></li>
        <li><v-btn :loading="isLoadingDelete" prepend-icon="mdi-trash-can" size="small" variant="tonal" @click="deletePost">Delete</v-btn></li>
      </menu>
      <menu v-else>
        <li><v-btn v-if="currentRoute.name !== 'Related Posts'" @click="viewRelatedPosts" prepend-icon="mdi-access-point" variant="outlined" size="small">View Related Content</v-btn></li>
      </menu>
    </div>
    <p>{{ props.post.content }}</p>
    <TagListComponent :post="$props.post" />
    <div class="base">
      <article class="timestamp">
        <p v-if="props.post.dateCreated !== props.post.dateUpdated">Edited on: {{ formatDate(props.post.dateUpdated) }}</p>
        <p v-else>Created on: {{ formatDate(props.post.dateCreated) }}</p>
      </article>
    </div>
  </div>
</template>

<style scoped>
.post-box {
  display: flex;
  flex-direction: column;
  gap: 0.7em;
}

p {
  margin: 0em;
}

.titlebar {
  display: flex;
  justify-content: space-between;
  gap: 2em;
}

.author {
  font-weight: bold;
  font-size: 1.2em;
}

menu {
  list-style-type: none;
  display: flex;
  flex-direction: row;
  align-items: baseline;
  gap: 1em;
  padding: 0;
  margin: 0;
}

.timestamp {
  display: flex;
  justify-content: flex-end;
  font-size: 0.9em;
  font-style: italic;
}

.base {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.base article:only-child {
  margin-left: auto;
}
</style>
