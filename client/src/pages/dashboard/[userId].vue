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
                <!-- update this placeholder when adding more events -->
                <v-text-field
                  v-model="records[event.id].single"
                    
                    :placeholder="['333bf', '444bf', '55bf', '555', '666', '777', 'minx'].includes(event.id) ? 'e.g. 1:23.45' : 'e.g. 12.34'"
                  dense
                  hide-details
                  outlined
                />
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="records[event.id].average"
                  :placeholder="['333bf', '444bf', '55bf','555', '666', '777', 'minx'].includes(event.id) ? 'e.g. 1:23.45' : 'e.g. 15.67'"
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
// Store original values to compare against
const originalRecords = reactive({})

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
  { id: '333bf', name: '3x3 Blindfolded', icon: 'mdi-eye-off' },
  { id: 'pyram', name: 'Pyraminx', icon: 'mdi-triangle-outline' },
  { id: 'skewb', name: 'Skewb', icon: 'mdi-rhombus-outline' },
  { id: 'clock', name: 'Clock', icon: 'mdi-clock-outline' },
  { id: 'sq1', name: 'Square 1', icon: 'mdi-square-off' },
  { id: 'minx', name: 'Megaminx', icon: 'mdi-hexagon-outline' },
  { id: '444bf', name: '4x4 Blindfolded', icon: 'mdi-eye-off-outline' },
  { id: '555bf', name: '5x5 Blindfolded', icon: 'mdi-eye-off' }
]

// Helper function to convert milliseconds back to display format
function msToTimeString(timeMs) {
  if (!timeMs) return ''
  
  const totalSeconds = timeMs / 1000
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  
  if (minutes > 0) {
    return `${minutes}:${seconds.toFixed(2).padStart(5, '0')}`
  } else {
    return seconds.toFixed(2)
  }
}

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
      originalRecords[event.id] = { single: '', average: '' }
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
        const { event_code, record_type, best_time_ms } = record

        if (!records[event_code]) {
          records[event_code] = { single: '', average: '' }
          originalRecords[event_code] = { single: '', average: '' }
        }

        const timeString = msToTimeString(best_time_ms)

        if (record_type === 'Single') {
          records[event_code].single = timeString
          originalRecords[event_code].single = timeString
        } else if (record_type === 'Average') {
          records[event_code].average = timeString
          originalRecords[event_code].average = timeString
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
    alert("Your info has been updated!");
  } catch (error) {
    console.error('Error saving user info:', error)
  } finally {
    savingUser.value = false
  }
}

//helper function
function parseTimeToMs(timeStr) {
  if (!timeStr) return null;

  // Remove whitespace
  timeStr = timeStr.trim();

  // Check for MM:SS.dd format
  if (timeStr.includes(':')) {
    const [minStr, secStr] = timeStr.split(':');
    const minutes = parseInt(minStr, 10) || 0;
    const seconds = parseFloat(secStr) || 0;
    //console.log("time in ms " + Math.round((minutes * 60 + seconds) * 1000));
    return Math.round((minutes * 60 + seconds) * 1000);
  } else {
    // SS.dd only
    const seconds = parseFloat(timeStr) || 0;
    return Math.round(seconds * 1000);
  }
}

// Helper function to normalize time strings for comparison
function normalizeTimeString(timeStr) {
  if (!timeStr || timeStr.trim() === '') return ''
  return timeStr.trim()
}

// Helper function to check if a time has changed
function hasTimeChanged(currentTime, originalTime) {
  const normalizedCurrent = normalizeTimeString(currentTime)
  const normalizedOriginal = normalizeTimeString(originalTime)
  return normalizedCurrent !== normalizedOriginal
}

async function saveRecords() {
  try {
    savingRecords.value = true
    let updatedCount = 0

    for (const [eventCode, record] of Object.entries(records)) {
      const originalRecord = originalRecords[eventCode] || { single: '', average: '' }
      
      // Check if single time has changed
      if (hasTimeChanged(record.single, originalRecord.single)) {
        if (record.single && record.single.trim() !== '') {
          const singleTimeMs = parseTimeToMs(record.single)
          if (singleTimeMs !== null) {
            await updatePersonalRecord(userId, {
              event_code: eventCode,
              record_type: 'Single',
              best_time_ms: singleTimeMs
            })
            // Update the original value after successful save
            originalRecords[eventCode].single = record.single
            updatedCount++
            console.log(`Updated ${eventCode} single: ${record.single}`)
          }
        } else if (originalRecord.single !== '') {
          // Handle case where user cleared a previously set time
          // You might want to call a delete API or set to null depending on your backend
          console.log(`Cleared ${eventCode} single time`)
        }
      }
      
      // Check if average time has changed
      if (hasTimeChanged(record.average, originalRecord.average)) {
        if (record.average && record.average.trim() !== '') {
          const averageTimeMs = parseTimeToMs(record.average)
          if (averageTimeMs !== null) {
            await updatePersonalRecord(userId, {
              event_code: eventCode,
              record_type: 'Average',
              best_time_ms: averageTimeMs
            })
            // Update the original value after successful save
            originalRecords[eventCode].average = record.average
            updatedCount++
            console.log(`Updated ${eventCode} average: ${record.average}`)
          }
        } else if (originalRecord.average !== '') {
          // Handle case where user cleared a previously set time
          console.log(`Cleared ${eventCode} average time`)
        }
      }
    }
    
    if (updatedCount > 0) {
      alert(`${updatedCount} record(s) have been updated!`)
    } else {
      alert("No changes detected - nothing to update.")
    }
  } catch (error) {
    console.error('Error saving records:', error)
  } finally {
    savingRecords.value = false
  }
}
</script>
