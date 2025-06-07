<template>
  <v-container fluid class="pa-4">
    <div class="text-center mb-6">
      <h1 class="text-h3 font-weight-bold mb-2">Wolfpack Cubing Club</h1>
      <p class="text-h6 text-medium-emphasis">Competition Leaderboards</p>
    </div>

    <v-card class="mx-auto" max-width="1200">
      <!-- Master Tabs -->
      <v-tabs
        v-model="activeMasterTab"
        align-tabs="center"
        color="primary"
        class="master-tabs"
        height="56"
      >
        <v-tab
          v-for="masterTab in masterTabs"
          :key="masterTab.id"
          :value="masterTab.id"
          class="text-none font-weight-bold"
        >
          <v-icon :icon="masterTab.icon" class="mr-2" />
          {{ masterTab.name }}
        </v-tab>
      </v-tabs>

      <v-divider class="border-opacity-50" />

      <v-tabs-window v-model="activeMasterTab">
        <v-tabs-window-item
          v-for="masterTab in masterTabs"
          :key="masterTab.id"
          :value="masterTab.id"
        >
          <!-- WCA Event Sub-tabs -->
          <v-tabs
            v-model="activeEventTab[masterTab.id]"
            align-tabs="center"
            color="secondary"
            show-arrows
            class="event-tabs"
            density="compact"
          >
            <v-tab
              v-for="event in wcaEvents"
              :key="event.id"
              :value="event.id"
              class="text-none"
              size="small"
            >
              <v-icon :icon="event.icon" class="mr-1" size="18" />
              {{ event.name }}
            </v-tab>
          </v-tabs>

          <v-divider />

          <v-tabs-window v-model="activeEventTab[masterTab.id]">
            <v-tabs-window-item
              v-for="event in wcaEvents"
              :key="event.id"
              :value="event.id"
            >
              <v-card-text class="pa-4">
                <div class="d-flex justify-space-between align-center mb-4">
                  <div>
                    <h2 class="text-h5 mb-1">{{ event.name }} - {{ masterTab.name }}</h2>
                    <p class="text-body-2 text-medium-emphasis mb-0">{{ masterTab.description }}</p>
                    
                    <!-- WCA sync info -->
                    <div v-if="masterTab.id === 'wca' && lastWcaSync" class="mt-2">
                      <v-chip 
                        color="info" 
                        variant="tonal" 
                        size="small"
                        prepend-icon="mdi-sync"
                      >
                        Last synced: {{ formatDate(lastWcaSync) }} {{ formatTime(lastWcaSync) }}
                      </v-chip>
                    </div>
                  </div>
                  <v-chip color="primary" variant="outlined">
                    {{ getCompetitorCount(masterTab.id, event.id) }} {{ masterTab.id === 'personal' ? 'members' : 'competitors' }}
                  </v-chip>
                </div>

                <v-data-table
                  :headers="getTableHeaders(masterTab.id)"
                  :items="getLeaderboardData(masterTab.id, event.id)"
                  :items-per-page="10"
                  class="elevation-1"
                  density="comfortable"
                  :no-data-text="`No ${masterTab.name.toLowerCase()} available for ${event.name}`"
                >
                  <template v-slot:item.rank="{ item }">
                    <v-chip
                      :color="getRankColor(item.rank)"
                      variant="flat"
                      size="small"
                      class="font-weight-bold"
                    >
                      {{ item.rank }}
                    </v-chip>
                  </template>

                  <template v-slot:item.name="{ item }">
                    <div class="d-flex align-center">
                      <v-avatar size="32" class="mr-3" color="primary">
                        {{ item.name.charAt(0) }}
                      </v-avatar>
                      <div>
                        <span class="font-weight-medium d-block">{{ item.name }}</span>
                        <span v-if="item.wcaId" class="text-caption text-medium-emphasis">{{ item.wcaId }}</span>
                      </div>
                    </div>
                  </template>

                  <template v-slot:item.time="{ item }">
                    <span class="font-mono font-weight-bold">{{ formatResultTime(item.time) }}</span>
                  </template>

                  <template v-slot:item.average="{ item }">
                    <span class="font-mono">{{ formatResultTime(item.average) }}</span>
                  </template>

                  <!-- Template for Single Date -->
                  <template v-slot:item.single_date="{ item }">
                    <div class="text-body-2">
                      <div>{{ formatDate(item.single_updated_at) }}</div>
                      <div class="text-caption text-medium-emphasis">{{ formatTime(item.single_updated_at) }}</div>
                    </div>
                  </template>

                  <!-- Template for Average Date -->
                  <template v-slot:item.average_date="{ item }">
                    <div class="text-body-2">
                      <div>{{ formatDate(item.average_updated_at) }}</div>
                      <div class="text-caption text-medium-emphasis">{{ formatTime(item.average_updated_at) }}</div>
                    </div>
                  </template>

                  <template v-slot:item.solves="{ item }">
                    <div class="solves-container">
                      <span 
                        v-for="(solve, index) in item.solves" 
                        :key="index"
                        :class="{ 
                          'excluded-solve': solve.excluded,
                          'font-mono': true,
                          'text-body-2': true,
                          'mr-1': true
                        }"
                      >
                        {{ solve.excluded ? `(${solve.time})` : solve.time }}
                      </span>
                    </div>
                  </template>

                  <template v-slot:item.competition="{ item }">
                    <span class="text-body-2">{{ item.competition }}</span>
                  </template>
                </v-data-table>
              </v-card-text>
            </v-tabs-window-item>
          </v-tabs-window>
        </v-tabs-window-item>
      </v-tabs-window>
    </v-card>
  </v-container>
</template>

<script setup>
console.log(import.meta.env.VITE_API_URL);

import { ref, computed } from 'vue'

const activeMasterTab = ref('personal')
const activeEventTab = ref({
  personal: '333',
  mock: '333',
  wca: '333'
})

const masterTabs = [
  {
    id: 'personal',
    name: 'Personal Records',
    icon: 'mdi-account-star',
    description: 'Club members\' personal best times'
  },
  {
    id: 'mock',
    name: 'Mock Comp Records',
    icon: 'mdi-school',
    description: 'Best times from practice competitions'
  },
  {
    id: 'wca',
    name: 'WCA Records',
    icon: 'mdi-trophy',
    description: 'Official WCA competition results'
  }
]

const wcaEvents = [
  {
    id: '333',
    name: '3x3',
    icon: 'mdi-cube-outline'
  },
  {
    id: '222',
    name: '2x2',
    icon: 'mdi-cube'
  },
  {
    id: '444',
    name: '4x4',
    icon: 'mdi-cube-outline'
  },
  {
    id: '555',
    name: '5x5',
    icon: 'mdi-cube-outline'
  },
  {
    id: '666',
    name: '6x6',
    icon: 'mdi-cube-outline'
  },
  {
    id: '777',
    name: '7x7',
    icon: 'mdi-cube-outline'
  },
  {
    id: '333oh',
    name: '3x3 One-Handed',
    icon: 'mdi-hand-back-left'
  },
  {
    id: 'pyram',
    name: 'Pyraminx',
    icon: 'mdi-triangle-outline'
  },
  {
    id: 'skewb',
    name: 'Skewb',
    icon: 'mdi-rhombus-outline'
  },
  {
    id: 'clock',
    name: 'Clock',
    icon: 'mdi-clock-outline'
  },
  {
    id: 'sq1',
    name: 'Square 1',
    icon: 'mdi-square-off'
  },
  {
    id: 'minx',
    name: 'Megaminx',
    icon: 'mdi-hexagon-outline'
  }
]

// Date formatting function (Eastern Time)
const formatDate = (utcString) => {
  if (!utcString) return '';
  const date = new Date(utcString); // No extra 'Z'
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'America/New_York'
  });
};

const formatTime = (utcString) => {
  if (!utcString) return '';
  const date = new Date(utcString);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: 'America/New_York'
  });
};


function formatResultTime(seconds) {
  if (seconds == null || seconds === '' || isNaN(seconds)) return ''
  seconds = Number(seconds)
  if (seconds < 60) {
    return seconds.toFixed(2) // Always two decimals, even .00
  }
  const minutes = Math.floor(seconds / 60)
  // .padStart(5, '0') so "1:05.02", not "1:5.02"
  const sec = (seconds % 60).toFixed(2).padStart(5, '0')
  return `${minutes}:${sec}`
}


const getTableHeaders = (masterTabId) => {
  let baseHeaders = [
    { title: 'Rank', key: 'rank', sortable: false, width: '80px' },
    { title: 'Name', key: 'name', sortable: true, width: '300px' },
    { title: 'Single', key: 'time', sortable: true, width: '120px' }
  ]

  if (masterTabId === 'wca') {
    baseHeaders.push(
      { title: 'Competition', key: 'single_competition', sortable: true, width: '200px' },
      { title: 'Average', key: 'average', sortable: true, width: '120px' },
      { title: 'Competition', key: 'average_competition', sortable: true, width: '200px' }
    )
  } else {
    baseHeaders.push(
      { title: 'Date Updated', key: 'single_date', sortable: true, width: '130px' },
      { title: 'Average', key: 'average', sortable: true, width: '120px' },
      { title: 'Date Updated', key: 'average_date', sortable: true, width: '130px' }
    )
  }
  
  return baseHeaders
}

import { onMounted } from 'vue'
import { getLeaderboardRecords } from '@/services/api'
import { getWcaLastSync } from '@/services/api'

const liveLeaderboards = ref({})
const wcaLeaderboards = ref({})
const lastWcaSync = ref(null)

onMounted(async () => {
  for (const event of wcaEvents) {
    const { data } = await getLeaderboardRecords(event.id)
    const single = data.records.Single || []
    const average = data.records.Average || []

    // Sort by time ascending
    single.sort((a, b) => a.time - b.time)
    average.sort((a, b) => a.time - b.time)

    liveLeaderboards.value[event.id] = {
      single,
      average
    }
  }
})

import { getWcaLeaderboardRecords } from '@/services/api'
onMounted(async () => {
  const { data } = await getWcaLastSync()
  lastWcaSync.value = data.lastSync
  for (const event of wcaEvents) {
    // ... existing code for personal records
    const { data } = await getWcaLeaderboardRecords(event.id)
    const single = data.records.Single || []
    const average = data.records.Average || []

    // Sort as needed
    single.sort((a, b) => a.time - b.time)
    average.sort((a, b) => a.time - b.time)

    wcaLeaderboards.value[event.id] = {
      single,
      average
    }
  }
})

const getLeaderboardData = (masterTabId, eventId) => {
  // Helper: merges singles & averages into a single user map
  function mergeRecords(singleList, avgList) {
    const users = {}
    // Add singles
    for (const rec of singleList) {
      users[rec.userId] = {
        userId: rec.userId,
        name: rec.name,
        wcaId: rec.wcaId,
        single: rec.time,
        single_updated_at: rec.updated_at
      }
    }
    // Add/merge averages
    for (const avg of avgList) {
      if (!users[avg.userId]) {
        users[avg.userId] = {
          userId: avg.userId,
          name: avg.name,
          wcaId: avg.wcaId,
          single: null,
          single_updated_at: null
        }
      }
      users[avg.userId].average = avg.time
      users[avg.userId].average_updated_at = avg.updated_at
    }
    return Object.values(users)
  }

  let singleList, avgList
  if (masterTabId === 'personal') {
    const records = liveLeaderboards.value[eventId]
    if (!records) return []
    singleList = records.single || []
    avgList = records.average || []
  } else if (masterTabId === 'wca') {
    const records = wcaLeaderboards.value[eventId]
    if (!records) return []
    singleList = records.single || []
    avgList = records.average || []
  } else {
    return []
  }

  // Merge and sort using the rules you requested
  const userList = mergeRecords(singleList, avgList)

  userList.sort((a, b) => {
    const aHasAvg = a.average !== undefined && a.average !== null && a.average !== '–'
    const bHasAvg = b.average !== undefined && b.average !== null && b.average !== '–'
    if (aHasAvg && !bHasAvg) return -1
    if (!aHasAvg && bHasAvg) return 1
    if (aHasAvg && bHasAvg) {
      if (a.average !== b.average) return a.average - b.average
      if (a.single != null && b.single != null) return a.single - b.single
      return 0
    }
    // Neither has average, sort by single
    if (a.single != null && b.single != null) return a.single - b.single
    return 0
  })

  // Return leaderboard rows with rank
  return userList.map((user, i) => ({
    rank: i + 1,
    name: user.name,
    wcaId: user.wcaId,
    time: user.single,
    average: user.average ?? '–',
    single_updated_at: user.single_updated_at,
    average_updated_at: user.average_updated_at,
    solves: []
  }))
}



const getCompetitorCount = (masterTabId, eventId) => {
  const data = getLeaderboardData(masterTabId, eventId)
  return data.length
}

const getRankColor = (rank) => {
  switch (rank) {
    case 1: return 'amber'
    case 2: return 'grey-lighten-1'
    case 3: return 'brown-lighten-2'
    default: return 'primary'
  }
}
</script>

<style scoped>
.font-mono {
  font-family: 'Roboto Mono', monospace;
}

.v-data-table {
  border-radius: 8px;
}

.master-tabs {
  background-color: rgba(var(--v-theme-surface-variant), 0.1);
}

.event-tabs {
  background-color: rgba(var(--v-theme-surface), 1);
}

.master-tabs .v-tab {
  font-size: 0.95rem;
}

.event-tabs .v-tab {
  font-size: 0.85rem;
  min-width: 140px;
}
</style>



// Mock data for different record types
// const mockLeaderboards = {
//   mock: {
//     '333': [
//       { 
//         rank: 1, 
//         name: 'Alice Johnson', 
//         time: '7.89', 
//         average: '9.87', 
//         solves: [
//           { time: '9.78', excluded: false },
//           { time: '10.12', excluded: false },
//           { time: '9.71', excluded: false },
//           { time: '7.89', excluded: true },   // fastest (excluded)
//           { time: '11.45', excluded: true }   // slowest (excluded)
//         ]
//       },
//       { 
//         rank: 2, 
//         name: 'Bob Smith', 
//         time: '8.45', 
//         average: '10.34', 
//         solves: [
//           { time: '10.56', excluded: false },
//           { time: '10.23', excluded: false },
//           { time: '10.23', excluded: false },
//           { time: '8.45', excluded: true },   // fastest (excluded)
//           { time: '12.34', excluded: true }   // slowest (excluded)
//         ]
//       },
//       { 
//         rank: 3, 
//         name: 'Carol Davis', 
//         time: '9.23', 
//         average: '11.56', 
//         solves: [
//           { time: '11.78', excluded: false },
//           { time: '11.45', excluded: false },
//           { time: '11.45', excluded: false },
//           { time: '9.23', excluded: true },   // fastest (excluded)
//           { time: '13.45', excluded: true }   // slowest (excluded)
//         ]
//       },
//       { 
//         rank: 4, 
//         name: 'David Wilson', 
//         time: '9.78', 
//         average: '12.12', 
//         solves: [
//           { time: '12.34', excluded: false },
//           { time: '11.89', excluded: false },
//           { time: '12.13', excluded: false },
//           { time: '9.78', excluded: true },   // fastest (excluded)
//           { time: '14.56', excluded: true }   // slowest (excluded)
//         ]
//       }
//     ],
//     '222': [
//       { 
//         rank: 1, 
//         name: 'Bob Smith', 
//         time: '2.12', 
//         average: '2.89', 
//         solves: [
//           { time: '2.89', excluded: false },
//           { time: '2.78', excluded: false },
//           { time: '3.01', excluded: false },
//           { time: '2.12', excluded: true },   // fastest (excluded)
//           { time: '3.45', excluded: true }    // slowest (excluded)
//         ]
//       },
//       { 
//         rank: 2, 
//         name: 'Alice Johnson', 
//         time: '2.34', 
//         average: '3.12', 
//         solves: [
//           { time: '3.23', excluded: false },
//           { time: '3.12', excluded: false },
//           { time: '3.01', excluded: false },
//           { time: '2.34', excluded: true },   // fastest (excluded)
//           { time: '3.89', excluded: true }    // slowest (excluded)
//         ]
//       },
//       { 
//         rank: 3, 
//         name: 'Carol Davis', 
//         time: '2.67', 
//         average: '3.45', 
//         solves: [
//           { time: '3.56', excluded: false },
//           { time: '3.45', excluded: false },
//           { time: '3.34', excluded: false },
//           { time: '2.67', excluded: true },   // fastest (excluded)
//           { time: '4.12', excluded: true }    // slowest (excluded)
//         ]
//       }
//     ]
//   }
// }