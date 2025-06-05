<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card>
          <v-card-title class="justify-center">
            Login
          </v-card-title>
          <v-card-text>
            <v-form @submit.prevent="onLogin">
              <v-text-field
                v-model="email"
                label="Email"
                type="email"
                required
              ></v-text-field>
              <v-text-field
                v-model="password"
                label="Password"
                type="password"
                required
              ></v-text-field>
              <v-btn
                color="primary"
                type="submit"
                block
                class="mt-4"
              >
                Login
              </v-btn>
            </v-form>
            <v-alert
              v-if="errorMsg"
              type="error"
              class="mt-3"
            >
              {{ errorMsg }}
            </v-alert>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { loginUser } from '@/services/api.js'

const router = useRouter()

const email = ref('')
const password = ref('')
const errorMsg = ref('')

async function onLogin() {
  errorMsg.value = ''
  if (!email.value || !password.value) {
    errorMsg.value = 'Please enter both email and password.'
    return
  }

  try {
    const payload = { email: email.value, password: password.value }
    const { data } = await loginUser(payload)
    // data.user = { id, name, email, wca_id, ... }
    // In a real app you’d store a token or user info in a store:
    localStorage.setItem('currentUser', JSON.stringify(data.user))

   
    console.log(data)
    // Redirect to a “Dashboard” (where you might add a record)
    router.push(`/dashboard/${data.user.id}`)
  } catch (err) {
    console.error(err)
    if (err.response?.status === 401) {
      errorMsg.value = 'Invalid credentials.'
    } else {
      errorMsg.value = 'Unexpected error.'
    }
  }
}
</script>