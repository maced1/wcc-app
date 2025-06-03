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
            v-model="userId"
            label="WCA ID"
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
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'

const name = ref('')
const email = ref('')
const userId = ref('')
const password = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const valid = ref(false)
const form = ref(null)

function register() {
  if (form.value.validate()) {
    // Registration logic here
    alert('Registered!')
  }
}
</script>
