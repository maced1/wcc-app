<!-- app/client/src/components/AddRecord.vue -->
<template>
  <v-container class="mx-auto" max-width="400">
    <v-form @submit.prevent="onAddRecord">
      <v-text-field
        v-model="event_code"
        label="Event Code (e.g. 333, 444)"
        required
      />
      <v-text-field
        v-model.number="best_time_ms"
        label="Best Time (ms)"
        type="number"
        required
      />
      <v-btn type="submit" color="primary" class="mt-4">
        Submit Record
      </v-btn>
    </v-form>

    <v-alert
      v-if="errorMsg"
      type="error"
      class="mt-3"
    >
      {{ errorMsg }}
    </v-alert>

    <v-alert
      v-if="successMsg"
      type="success"
      class="mt-3"
    >
      {{ successMsg }}
    </v-alert>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { updatePersonalRecord } from '@/services/api.js'

const route = useRoute()
// we assume userId is passed via route param
const userId = Number(route.params.userId)

const event_code = ref('')
const best_time_ms = ref(null)
const errorMsg = ref('')
const successMsg = ref('')

async function onAddRecord() {
  errorMsg.value = ''
  successMsg.value = ''

  if (!event_code.value || best_time_ms.value == null) {
    errorMsg.value = 'Event code and best time are required.'
    return
  }

  try {
    const payload = {
      user_id: userId,
      event_code: event_code.value,
      best_time_ms: best_time_ms.value
    }
    const { data } = await updatePersonalRecord(payload)
    successMsg.value = `Record added (ID: ${data.record.id})`
    event_code.value = ''
    best_time_ms.value = null
  } catch (err) {
    console.error(err)
    if (err.response?.data?.error) {
      errorMsg.value = err.response.data.error
    } else {
      errorMsg.value = 'Failed to add record.'
    }
  }
}
</script>

<style scoped>
/* optional tweaks */
</style>
