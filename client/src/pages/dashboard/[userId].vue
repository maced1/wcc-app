<template>
  <v-container>
    <h1 v-if="userData">Welcome, {{ userData.name }}</h1>
    <h2 class="mb-4">Edit Your Profile & Records</h2>

    <div v-if="loading">Loading...</div>
    
    <div v-else>
      <!-- User Info Form -->
      <v-form v-model="userFormValid" @submit.prevent="saveUserInfo">
        <v-card class="mb-6">
          <v-card-title>User Info</v-card-title>
          <v-card-text>
            <v-text-field 
              v-model="userForm.name"
              label="Name" 
              required 
            />
            <v-text-field 
              v-model="userForm.email"
              label="Email" 
              type="email" 
              required 
            />
            <v-select
              v-model="userForm.college_year"
              label="College Year"
              :items="collegeYears"
            />
            <v-text-field 
              v-model="userForm.wca_id"
              label="WCA ID" 
            />
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn 
              color="primary" 
              type="submit" 
              :disabled="!userFormValid"
              :loading="savingUser"
            >
              Save User Info
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-form>

      <!-- Personal Records Form -->
      <v-form v-model="recordsFormValid" @submit.prevent="saveRecords">
        <v-card>
          <v-card-title>Personal Records</v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" md="4">
                <strong>Event</strong>
              </v-col>
              <v-col cols="12" md="4">
                <strong>Single</strong>
              </v-col>
              <v-col cols="12" md="4">
                <strong>Average</strong>
              </v-col>
            </v-row>
            
            <v-row v-for="event in wcaEvents" :key="event.id" class="align-center">
              <v-col cols="12" md="4" class="py-2">
                <span class="font-weight-medium">{{ event.name }}</span>
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="records[event.id].single"
                  placeholder="e.g. 12.34"
                  dense
                  hide-details
                  outlined
                />
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="records[event.id].average"
                  placeholder="e.g. 15.67"
                  dense
                  hide-details
                  outlined
                />
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn 
              color="primary" 
              type="submit" 
              :disabled="!recordsFormValid"
              :loading="savingRecords"
            >
              Save Records
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </div>
  </v-container>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { onMounted, ref, reactive } from 'vue'
import { getUserData, getUserRecords, updatePersonalRecord, updateUserData } from '@/services/api'

const route = useRoute()
const userId = route.params.userId

const userData = ref(null)
const loading = ref(true)
const userFormValid = ref(true)
const recordsFormValid = ref(true)
const savingUser = ref(false)
const savingRecords = ref(false)

// Separate reactive objects to avoid cross-contamination
const userForm = reactive({
  name: '',
  email: '',
  college_year: '',
  wca_id: ''
})

const records = reactive({})

const collegeYears = [
  'First Year', 
  'Second Year', 
  'Third Year', 
  'Fourth Year', 
  'Graduate'
]

const wcaEvents = [
  { id: '333', name: '3x3', icon: 'mdi-cube-outline' },
  { id: '222', name: '2x2', icon: 'mdi-cube' },
  { id: '444', name: '4x4', icon: 'mdi-cube-outline' },
  { id: '555', name: '5x5', icon: 'mdi-cube-outline' },
  { id: '666', name: '6x6', icon: 'mdi-cube-outline' },
  { id: '777', name: '7x7', icon: 'mdi-cube-outline' },
  { id: '333oh', name: '3x3 One-Handed', icon: 'mdi-hand-back-left' },
  { id: 'pyram', name: 'Pyraminx', icon: 'mdi-triangle-outline' },
  { id: 'skewb', name: 'Skewb', icon: 'mdi-rhombus-outline' },
  { id: 'clock', name: 'Clock', icon: 'mdi-clock-outline' },
  { id: 'sq1', name: 'Square 1', icon: 'mdi-square-off' },
  { id: 'minx', name: 'Megaminx', icon: 'mdi-hexagon-outline' }
]

// Helper functions to avoid direct v-model on nested reactive objects
const getRecordValue = (eventId, type) => {
  return records.value[eventId]?.[type] || ''
}

const updateRecord = (eventId, type, value) => {
  if (!records.value[eventId]) {
    records.value[eventId] = { single: '', average: '' }
  }
  records.value[eventId][type] = value
}

onMounted(async () => {
  try {
    // Initialize records structure first
    wcaEvents.forEach(event => {
      records[event.id] = { single: '', average: '' }
    })

    // Load user data
    const { data: user } = await getUserData(userId)
    userData.value = user
    
    // Set user form values directly
    userForm.name = user.name || ''
    userForm.email = user.email || ''
    userForm.wca_id = user.wca_id || ''
    userForm.college_year = user.college_year || ''

    // Load records
    const { data: recordData } = await getUserRecords(userId)
    
    // Handle different possible response formats
    let recordList = []
    if (Array.isArray(recordData)) {
      recordList = recordData
    } else if (recordData && Array.isArray(recordData.records)) {
      recordList = recordData.records
    } else if (recordData && typeof recordData === 'object' && recordData.records !== undefined) {
      // Handle case where records is an empty array: {records: []}
      recordList = []
    } else if (recordData && typeof recordData === 'object') {
      // If it's an object with event keys, convert to array
      recordList = Object.entries(recordData).map(([event, data]) => ({
        event,
        ...data
      }))
    }
    
    console.log('Record data format:', recordData)
    console.log('Processed record list:', recordList)
    
    // Update records safely - only if we have records
    if (recordList && recordList.length > 0) {
      recordList.forEach(record => {
        if (records[record.event]) {
          records[record.event] = {
            single: record.single || '',
            average: record.average || ''
          }
        }
      })
    }

  } catch (error) {
    console.error('Error loading data:', error)
  } finally {
    loading.value = false
  }
})

async function saveUserInfo() {
  try {
    savingUser.value = true
    console.log('Saving user info:', userForm)
    
    // implement user info API call
    const response = await updateUserData(userId, userForm)
    
    // // Simulate API call
    // await new Promise(resolve => setTimeout(resolve, 1000))
    console.log('API response:', response)
  } catch (error) {
    console.error('Error saving user info:', error)
  } finally {
    savingUser.value = false
  }
}

async function saveRecords() {
  try {
    savingRecords.value = true
    console.log('Saving records:', records)
    
    // TODO: Implement records API call
    // for (const [eventId, record] of Object.entries(records)) {
    //   if (record.single || record.average) {
    //     await updatePersonalRecord(userId, eventId, record)
    //   }
    // }
    
    // Simulate API call
    // await new Promise(resolve => setTimeout(resolve, 1000))
    
  } catch (error) {
    console.error('Error saving records:', error)
  } finally {
    savingRecords.value = false
  }
}
</script>