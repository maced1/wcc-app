<template>
  <v-container>
     <h1 v-if="userData">Welcome, {{ userData.name }}</h1>
    <!-- Put leaderboard, personal records, etc. here -->
  </v-container>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { onMounted, ref } from 'vue'
import { getUserData } from '@/services/api' // this should point to a function that hits /api/users/:id

const route = useRoute()
const userId = route.params.userId

const userData = ref(null)

onMounted(async () => {
  if (!userId) {
    console.error('Invalid or missing userId')
    return
  }

  try {
    const { data } = await getUserData(userId)
    console.log('Full response:', data)
    userData.value = data
  } catch (err) {
    console.error(`Failed to load user with ID: ${userId}`, err)
  }
})
</script>
