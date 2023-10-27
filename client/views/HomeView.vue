<script setup lang="ts"></script>

<template>
  <main>
    <h1>Welcome to Unplug!</h1>
    <RouterLink :to="{ name: 'Login' }">
      <v-btn color="primary" variant="tonal" size="x-large"> Login </v-btn>
    </RouterLink>
  </main>
</template>

<style scoped>
h1 {
  text-align: center;
}

main {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
