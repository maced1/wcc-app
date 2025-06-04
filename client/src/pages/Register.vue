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
            :rules="[v => !!v || 'Confirm password', v => v === password || 'Passwords must match']"
            required
          />
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn 
        color="primary" 
        type="submit"
        block 
        @click="register"  
        :disabled="!valid"
        >
          Register
        </v-btn>
        <v-alert type="error" v-if="errorMsg">{{ errorMsg }}</v-alert>
        <v-alert type="success" v-if="successMsg">{{ successMsg }}</v-alert>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script setup>


// const name = ref('')
// const email = ref('')
// const password = ref('')
// const confirmPassword = ref('')
// const showPassword = ref(false)
// const wca_id = ref('')
// const errorMsg = ref('')
// const successMsg = ref('')
// const valid = ref(false)
// const form = ref(null)


// const register = async () => {
//   errorMsg.value = ''
//   successMsg.value = ''
//   // Validate form
//   if (!form.value) return
//   const isValid = await form.value.validate()
//   if (!isValid) {
//     errorMsg.value = 'Please fix the errors above.'
//     return
//   }
//   // Simulate registration API call
//   try {
//     // Replace with your actual registration API call
//     // Example:
//     // await api.register({ name: name.value, email: email.value, wca_id: wca_id.value, password: password.value })
//     // Simulate success:
//     successMsg.value = 'Registration successful!'
//     // Optionally, reset form fields
//     name.value = ''
//     email.value = ''
//     wca_id.value = ''
//     password.value = ''
//     confirmPassword.value = ''
//     form.value.resetValidation()
//   } catch (err) {
//     errorMsg.value = 'Registration failed. Please try again.'
//   }
// }
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { registerUser } from '@/services/api.js'

const router = useRouter()

const name = ref('')
const email = ref('')
const password = ref('')
const wca_id = ref('')

const errorMsg = ref('')
const successMsg = ref('')

async function onRegister() {
  errorMsg.value = ''
  successMsg.value = ''

  if (!name.value || !email.value || !password.value) {
    errorMsg.value = 'Name, email, and password are required.'
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
    successMsg.value = `Registered! Your user ID is ${data.user.id}.`
    // Optionally redirect to login page after a short delay:
    setTimeout(() => {
      router.push({ name: 'Login' })
    }, 1200)
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
