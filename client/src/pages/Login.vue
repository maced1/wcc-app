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
                :loading="loading"
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
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'

const auth = useAuthStore()
const { user, isAuthenticated } = storeToRefs(auth)

const router = useRouter()

const email = ref('')
const password = ref('')
const errorMsg = ref('')
const loading = ref(false)

async function onLogin() {
  errorMsg.value = ''
  loading.value = true
  
  if (!email.value || !password.value) {
    errorMsg.value = 'Please enter both email and password.'
    loading.value = false
    return
  }

  try {
    const payload = { email: email.value, password: password.value }
    const response = await loginUser(payload)
    
    console.log('API response:', response)
    
    // Handle the response structure - your API returns { user: {...} }
    const userData = response.data?.user || response.user
    
    if (!userData) {
      throw new Error('No user data received')
    }

    // Since your API doesn't return a token, we'll use a placeholder
    // In production, make sure your API returns a proper JWT token
    const token = response.data?.token || 'session-token'
    
    // Call the store login method
    auth.login(token, userData)
    
    console.log('After login - isAuthenticated:', isAuthenticated.value)
    console.log('After login - user:', user.value)

    // Navigate to dashboard
    await router.push(`/dashboard/${userData.id}`)
    
  } catch (err) {
    console.error('Login error:', err)
    
    if (err?.response?.status === 401) {
      errorMsg.value = 'Invalid credentials.'
    } else if (err?.response?.status === 422) {
      errorMsg.value = 'Please check your input and try again.'
    } else if (err?.response?.data?.message) {
      errorMsg.value = err.response.data.message
    } else {
      errorMsg.value = 'Login failed. Please try again.'
    }
  } finally {
    loading.value = false
  }
}
</script>