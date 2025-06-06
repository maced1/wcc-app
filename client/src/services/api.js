// app/client/src/services/api.js
import axios from 'axios'

const API = axios.create({
  baseURL: 'http://localhost:8080/api'
})

// Attach token to every request
API.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

/** USERS **/
export const registerUser = payload => API.post('/users/register', payload)
export const loginUser = payload => API.post('/users/login', payload)
export const getUserData = userId => API.get(`/users/${userId}`)
export const getUserRecords = userId => API.get(`/users/${userId}/records`)
export const updateUserData = (userId, payload) => API.put(`/users/${userId}`, payload)

/** PERSONAL RECORDS **/
export const updatePersonalRecord = (userId, payload) => API.post(`/records/user/${userId}`, payload)
//export const deletePersonalRecord = recordId => API.delete(`/records/${recordId}`)
export const getLeaderboardRecords = (eventCode) => API.get(`/records/event/${eventCode}`)

