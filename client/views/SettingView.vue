<script setup lang="ts">
import SetQuietHoursForm from "@/components/Limit/SetQuietHoursForm.vue";
import UpdateUserForm from "@/components/Setting/UpdateUserForm.vue";
import router from "@/router";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";

const { currentUsername } = storeToRefs(useUserStore());
const { deleteUser } = useUserStore();

async function delete_() {
  await deleteUser();
  void router.push({ name: "Home" });
}
</script>

<template>
  <main>
    <article>
      <h1>Quiet Hours</h1>
      <SetQuietHoursForm />
    </article>
    <article>
      <h1>Settings for {{ currentUsername }}</h1>
      <UpdateUserForm />
      <v-btn variant="text" id="delete-btn" @click="delete_">Delete User</v-btn>
    </article>
  </main>
</template>

<style scoped>
main {
  display: flex;
  flex-direction: column;
  margin: 1em;
  gap: 1em;
}

h1 {
  margin-bottom: 0;
}

article {
  border: solid;
  padding: 0 1em 1em 1em;
}
</style>
