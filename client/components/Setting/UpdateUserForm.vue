<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { ref } from "vue";

let username = ref("");
let password = ref("");

const { updateUser, updateSession } = useUserStore();

async function updateUsername() {
  await updateUser({ username: username.value });
  await updateSession();
  username.value = "";
}

async function updatePassword() {
  await updateUser({ password: password.value });
  await updateSession();
  password.value = "";
}
</script>

<template>
  <h2>Update user details</h2>
  <form @submit.prevent="updateUsername" class="pure-form">
    <fieldset>
      <label>Change your username</label>
      <div class="form-fieldset">
        <input type="text" placeholder="New username" v-model="username" required />
        <v-btn type="submit" id="action-btn" variant="text">Update username</v-btn>
      </div>
    </fieldset>
  </form>

  <form @submit.prevent="updatePassword" class="pure-form">
    <fieldset>
      <label>Change your password</label>
      <div class="form-fieldset">
        <input type="password" placeholder="New password" v-model="password" required />
        <v-btn type="submit" id="action-btn" variant="text">Update password</v-btn>
      </div>
    </fieldset>
  </form>
</template>

<style scoped>
.form-fieldset {
  display: flex;
  gap: 1em;
  align-items: center;
}
</style>
