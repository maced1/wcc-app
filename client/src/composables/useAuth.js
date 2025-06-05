// NOT IN USE
// 
// // src/composables/useAuth.js 
// import { ref, computed } from 'vue'

// const token = ref(localStorage.getItem('token') || '')
// const user = ref(JSON.parse(localStorage.getItem('currentUser') || null))

// export function useAuth() {
//   const isAuthenticated = computed(() => !!token.value)

//   function login(newToken, userData) {
//     token.value = newToken
//     user.value = userData
//     localStorage.setItem('token', newToken)
//     localStorage.setItem('currentUser', JSON.stringify(userData))
//   }

//   function logout() {
//     token.value = ''
//     user.value = null
//     localStorage.removeItem('token')
//     localStorage.removeItem('currentUser')
//   }

//   return {
//     token,
//     user,
//     isAuthenticated,
//     login,
//     logout
//   }
// }
