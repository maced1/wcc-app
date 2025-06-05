<script setup>
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia';

const auth = useAuthStore()
const { user, isAuthenticated } = storeToRefs(auth);
const router = useRouter()

function handleLogout() {
  auth.logout()
  router.push('/')
}
</script>

<template>
  <v-app-bar app color="primary" dark>
    <v-toolbar-title text to="/">Wolfpack Cubing Club</v-toolbar-title>
    <v-spacer></v-spacer>
    
    <template v-if="isAuthenticated">
      <v-btn text to="/">Home</v-btn>
      <v-btn text :to="`/dashboard/${user.id}`">Dashboard</v-btn>
      <v-btn text @click="handleLogout">Logout</v-btn>
    </template>
    <template v-else>
      <v-btn text to="/">Home</v-btn>
      <v-btn text to="/login">Login</v-btn>
      <v-btn text to="/register">Register</v-btn>
    </template>
  </v-app-bar>
</template>
