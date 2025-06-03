<template>
  <v-app>
    <AppHeader />
    <v-main class="main-content">
      <router-view />
    </v-main>
    <AppFooter />
  </v-app>
</template>

<script setup>
// Nothing needed here
</script>

<style scoped>
.main-content {
  min-height: calc(100vh - 20px - 20px); /* Adjust based on your header and footer heights */
}
</style>