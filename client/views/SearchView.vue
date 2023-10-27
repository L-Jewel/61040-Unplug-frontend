<script setup lang="ts">
import { ref } from "vue";
import { UserDoc } from "../../server/concepts/user";
import { useUserStore } from "../stores/user";
import { fetchy } from "../utils/fetchy";

const userStore = useUserStore();
const { currentUsername } = userStore;

const searchQuery = ref("");
let searchResults = ref<Array<Record<string, string>>>([]);

const isLoadingResults = ref(false);

const searchUsers = async () => {
  isLoadingResults.value = true;
  try {
    let users = [];
    if (searchQuery.value === "") {
      users = await fetchy(`/api/users`, "GET");
    } else {
      users = await fetchy(`/api/search/users/${searchQuery.value}`, "GET");
    }
    searchResults.value = users.filter((user: UserDoc) => user.username !== currentUsername);
  } catch {
    return;
  }
  isLoadingResults.value = false;
};
</script>

<template>
  <main>
    <div class="searchbar">
      <v-text-field prepend-inner-icon="mdi-magnify" v-model="searchQuery" variant="outlined">
        <template v-slot:append>
          <v-btn @click="searchUsers" :loading="isLoadingResults" variant="tonal">Search</v-btn>
        </template>
      </v-text-field>
    </div>
    <section v-if="searchResults.length !== 0">
      <article v-for="result in searchResults" :key="result.username">
        <RouterLink :to="{ name: 'Explore', params: { username: result.username } }">{{ result.username }}</RouterLink>
      </article>
    </section>
    <section v-else><article>No users found!</article></section>
  </main>
</template>

<style scoped>
main {
  padding: 1em;
}

.searchbar {
  display: flex;
  gap: 1em;
  align-items: center;
}

article {
  padding: 1em;
}
</style>
