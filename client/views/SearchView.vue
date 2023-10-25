<script setup lang="ts">
import { onBeforeMount, ref } from "vue";
import { UserDoc } from "../../server/concepts/user";
import { fetchy } from "../utils/fetchy";

let allUsers = ref([]);
let allUsernames = ref([]);

const getUsers = async () => {
  let getUsersResults;
  try {
    getUsersResults = await fetchy(`/api/users`, "GET");
  } catch {
    console.log("error!");
    return;
  }
  allUsers.value = getUsersResults;
  allUsernames.value = getUsersResults.map((user: UserDoc) => user.username);
};

// const searchUsers = async (searchQuery: Event) => {
//   console.log(searchQuery.target.value);
//   //   try {
//   //     const users = await fetchy(`/search/users/${searchQuery}`, "GET");
//   //     console.log(users);
//   //   } catch {
//   //     return;
//   //   }
// };

onBeforeMount(async () => {
  await getUsers();
});

// console.log("all users", await getUsers());
</script>

<template>
  <main>
    <v-autocomplete :items="allUsernames" variant="outlined"></v-autocomplete>
    <!-- {{ selectedUser }} -->
    <!-- <v-text-field v-model="query" variant="outlined" />
    {{ query }}
    <SearchResultsComponent :query="query" /> -->
  </main>
</template>

<style scoped>
main {
  padding: 1em;
}
</style>
