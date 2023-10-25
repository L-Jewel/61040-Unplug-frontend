<script setup lang="ts">
import { ref } from "vue";
let userResults = ref([]);

// const searchUsers = async () => {
//   try {
//     const users = await fetchy(`/search/users/${props.query}`, "GET");
//     console.log(users);
//   } catch {
//     return;
//   }
// };
</script>

<template>
  <div class="search-results">
    <div v-for="result in userResults" :key="result" class="search-result">
      {{ result }}
    </div>
  </div>
</template>

<style scoped></style>
