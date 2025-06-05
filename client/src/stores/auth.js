// src/stores/auth.js
import { defineStore } from 'pinia'

function getStoredUser() {
  try {
    const stored = localStorage.getItem('currentUser')
    return stored ? JSON.parse(stored) : null
  } catch (e) {
    console.error('Error parsing stored user:', e)
    localStorage.removeItem('currentUser')
    return null
  }
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || '',
    user: getStoredUser()
  }),

  getters: {
    isAuthenticated: (state) => !!state.token && !!state.user,
  },

  actions: {
    login(token, user) {
      console.log('Store login called with:', { token, user })
      
      this.token = token //|| 'dummy-token' // Since your API doesn't return a token
      this.user = user
      
      if (token) {
        localStorage.setItem('token', token)
      } else {
        localStorage.setItem('token', 'dummy-token')
      }
      localStorage.setItem('currentUser', JSON.stringify(user))
      
      console.log('Store state after login:', {
        token: this.token,
        user: this.user,
        isAuthenticated: this.isAuthenticated
      })
    },
    logout() {
      this.token = ''
      this.user = null
      localStorage.removeItem('token')
      localStorage.removeItem('currentUser')
    }
  }
})
