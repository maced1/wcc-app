// app/client/src/services/api.js
import axios from 'axios'

const BASE_URL = 'http://localhost:8080/api'

/** USERS **/
export function registerUser(payload) {
  return axios.post(`${BASE_URL}/users/register`, payload)
}

export function loginUser(payload) {
  return axios.post(`${BASE_URL}/users/login`, payload)
}

export function getUserData(userId) {
  return axios.get(`${BASE_URL}/users/${userId}`)
}

export function getUserRecords(userId) {
  return axios.get(`${BASE_URL}/users/${userId}/records`)
}

/** PERSONAL RECORDS **/
export function addPersonalRecord(payload) {
  return axios.post(`${BASE_URL}/records`, payload)
}

export function updatePersonalRecord(recordId, payload) {
  return axios.put(`${BASE_URL}/records/${recordId}`, payload)
}

export function deletePersonalRecord(recordId) {
  return axios.delete(`${BASE_URL}/records/${recordId}`)
}

export function getLeaderboard(eventCode) {
  return axios.get(`${BASE_URL}/records/${eventCode}`)
}
