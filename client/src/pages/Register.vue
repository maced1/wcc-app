<template>
  <v-container class="d-flex justify-center align-center" style="min-height: 100vh;">
    <v-card width="400">
      <v-card-title class="justify-center">
        Register
      </v-card-title>
      <v-card-text>
        <v-form ref="form" v-model="valid">
          <v-text-field
            v-model="name"
            label="Name"
            :rules="[v => !!v || 'Name is required']"
            required
          />
          <v-text-field
            v-model="email"
            label="Email"
            :rules="[v => !!v || 'Email is required', v => /.+@.+\..+/.test(v) || 'E-mail must be valid']"
            required
          />
          <v-text-field
            v-model="wca_id"
            label="WCA ID (optional)"
          />
          <v-text-field
            v-model="password"
            label="Password"
            :type="showPassword ? 'text' : 'password'"
            :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append="showPassword = !showPassword"
            :rules="[v => !!v || 'Password is required', v => v.length >= 6 || 'Min 6 characters']"
            required
          />
          <v-text-field
            v-model="confirmPassword"
            label="Confirm Password"
            :type="showPassword ? 'text' : 'password'"
            :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append="showPassword = !showPassword"
            :rules="[
              v => !!v || 'Confirm your password',
              v => v === password || 'Passwords must match'
            ]"
            required
          />
        </v-form>
              </v-card-text>
              <v-card-actions>
                <v-form ref="form" v-model="valid" @submit.prevent="onRegister">
          <!-- all your fields here -->
          <v-btn 
            color="primary"
            type="submit"
            block
            :disabled="!valid"
          >
            Register
          </v-btn>
        </v-form>
        <v-alert type="error" v-if="errorMsg">{{ errorMsg }}</v-alert>
        <v-alert type="success" v-if="successMsg">{{ successMsg }}</v-alert>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { registerUser } from '@/services/api.js'

const router = useRouter()

const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const wca_id = ref('')
const showPassword = ref(false)

const errorMsg = ref('')
const successMsg = ref('')
const valid = ref(false)
const form = ref(null)

const onRegister = async () => {
  errorMsg.value = ''
  successMsg.value = ''

  if (!form.value) return
  const isValid = await form.value.validate()
  if (!isValid) {
    errorMsg.value = 'Please fix the form errors.'
    return
  }

  try {
    const payload = {
      name: name.value,
      email: email.value,
      password: password.value,
      wca_id: wca_id.value || null
    }

    const { data } = await registerUser(payload)
    successMsg.value = `Registered! Your user ID is ${data.user.id}. Please login`

    await router.push('/login')
  } catch (err) {
    console.error(err)
    if (err.response?.data?.error) {
      errorMsg.value = err.response.data.error
    } else {
      errorMsg.value = 'Unexpected error.'
    }
  }
}

</script>
