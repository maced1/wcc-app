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
                    <span class="font-mono font-weight-bold">{{ item.time }}</span>
                  </template>

                  <template v-slot:item.average="{ item }">
                    <span class="font-mono">{{ item.average || 'DNF' }}</span>
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

const getTableHeaders = (masterTabId) => {
  const baseHeaders = [
    { title: 'Rank', key: 'rank', sortable: false, width: '80px' },
    { title: 'Name', key: 'name', sortable: true, width: '300px' },
    { title: 'Single', key: 'time', sortable: true, width: '120px' },
    { title: 'Average', key: 'average', sortable: true, width: '120px' }
  ]

  if (masterTabId === 'wca') {
    baseHeaders.push({ title: 'Competition', key: 'competition', sortable: true, width: '200px' })
  }
  
  baseHeaders.push({ title: 'Solves', key: 'solves', sortable: false, width: '300px' })
  
  return baseHeaders
}

// Mock data for different record types
const mockLeaderboards = {
  personal: {
    '333': [
      { 
        rank: 1, 
        name: 'Alice Johnson', 
        time: '8.24', 
        average: '10.45', 
        solves: [
          { time: '10.45', excluded: false },
          { time: '11.23', excluded: false },
          { time: '9.78', excluded: false },
          { time: '8.24', excluded: true },  // fastest (excluded)
          { time: '12.34', excluded: true }  // slowest (excluded)
        ]
      },
      { 
        rank: 2, 
        name: 'Bob Smith', 
        time: '9.12', 
        average: '11.23', 
        solves: [
          { time: '11.45', excluded: false },
          { time: '10.78', excluded: false },
          { time: '11.46', excluded: false },
          { time: '9.12', excluded: true },   // fastest (excluded)
          { time: '13.45', excluded: true }   // slowest (excluded)
        ]
      },
      { 
        rank: 3, 
        name: 'Carol Davis', 
        time: '9.87', 
        average: '12.01', 
        solves: [
          { time: '12.34', excluded: false },
          { time: '11.89', excluded: false },
          { time: '11.80', excluded: false },
          { time: '9.87', excluded: true },   // fastest (excluded)
          { time: '14.56', excluded: true }   // slowest (excluded)
        ]
      },
      { 
        rank: 4, 
        name: 'David Wilson', 
        time: '10.34', 
        average: '12.67', 
        solves: [
          { time: '12.45', excluded: false },
          { time: '13.12', excluded: false },
          { time: '12.45', excluded: false },
          { time: '10.34', excluded: true },  // fastest (excluded)
          { time: '15.23', excluded: true }   // slowest (excluded)
        ]
      },
      { 
        rank: 5, 
        name: 'Emma Brown', 
        time: '11.02', 
        average: '13.45', 
        solves: [
          { time: '13.78', excluded: false },
          { time: '13.45', excluded: false },
          { time: '13.12', excluded: false },
          { time: '11.02', excluded: true },  // fastest (excluded)
          { time: '16.34', excluded: true }   // slowest (excluded)
        ]
      }
    ],
    '222': [
      { 
        rank: 1, 
        name: 'Bob Smith', 
        time: '2.45', 
        average: '3.21', 
        solves: [
          { time: '3.12', excluded: false },
          { time: '3.45', excluded: false },
          { time: '3.06', excluded: false },
          { time: '2.45', excluded: true },   // fastest (excluded)
          { time: '4.23', excluded: true }    // slowest (excluded)
        ]
      },
      { 
        rank: 2, 
        name: 'Alice Johnson', 
        time: '2.78', 
        average: '3.67', 
        solves: [
          { time: '3.89', excluded: false },
          { time: '3.56', excluded: false },
          { time: '3.56', excluded: false },
          { time: '2.78', excluded: true },   // fastest (excluded)
          { time: '4.78', excluded: true }    // slowest (excluded)
        ]
      },
      { 
        rank: 3, 
        name: 'Carol Davis', 
        time: '3.12', 
        average: '4.02', 
        solves: [
          { time: '4.23', excluded: false },
          { time: '3.89', excluded: false },
          { time: '3.94', excluded: false },
          { time: '3.12', excluded: true },   // fastest (excluded)
          { time: '5.67', excluded: true }    // slowest (excluded)
        ]
      }
    ]
  },
  mock: {
    '333': [
      { 
        rank: 1, 
        name: 'Alice Johnson', 
        time: '7.89', 
        average: '9.87', 
        solves: [
          { time: '9.78', excluded: false },
          { time: '10.12', excluded: false },
          { time: '9.71', excluded: false },
          { time: '7.89', excluded: true },   // fastest (excluded)
          { time: '11.45', excluded: true }   // slowest (excluded)
        ]
      },
      { 
        rank: 2, 
        name: 'Bob Smith', 
        time: '8.45', 
        average: '10.34', 
        solves: [
          { time: '10.56', excluded: false },
          { time: '10.23', excluded: false },
          { time: '10.23', excluded: false },
          { time: '8.45', excluded: true },   // fastest (excluded)
          { time: '12.34', excluded: true }   // slowest (excluded)
        ]
      },
      { 
        rank: 3, 
        name: 'Carol Davis', 
        time: '9.23', 
        average: '11.56', 
        solves: [
          { time: '11.78', excluded: false },
          { time: '11.45', excluded: false },
          { time: '11.45', excluded: false },
          { time: '9.23', excluded: true },   // fastest (excluded)
          { time: '13.45', excluded: true }   // slowest (excluded)
        ]
      },
      { 
        rank: 4, 
        name: 'David Wilson', 
        time: '9.78', 
        average: '12.12', 
        solves: [
          { time: '12.34', excluded: false },
          { time: '11.89', excluded: false },
          { time: '12.13', excluded: false },
          { time: '9.78', excluded: true },   // fastest (excluded)
          { time: '14.56', excluded: true }   // slowest (excluded)
        ]
      }
    ],
    '222': [
      { 
        rank: 1, 
        name: 'Bob Smith', 
        time: '2.12', 
        average: '2.89', 
        solves: [
          { time: '2.89', excluded: false },
          { time: '2.78', excluded: false },
          { time: '3.01', excluded: false },
          { time: '2.12', excluded: true },   // fastest (excluded)
          { time: '3.45', excluded: true }    // slowest (excluded)
        ]
      },
      { 
        rank: 2, 
        name: 'Alice Johnson', 
        time: '2.34', 
        average: '3.12', 
        solves: [
          { time: '3.23', excluded: false },
          { time: '3.12', excluded: false },
          { time: '3.01', excluded: false },
          { time: '2.34', excluded: true },   // fastest (excluded)
          { time: '3.89', excluded: true }    // slowest (excluded)
        ]
      },
      { 
        rank: 3, 
        name: 'Carol Davis', 
        time: '2.67', 
        average: '3.45', 
        solves: [
          { time: '3.56', excluded: false },
          { time: '3.45', excluded: false },
          { time: '3.34', excluded: false },
          { time: '2.67', excluded: true },   // fastest (excluded)
          { time: '4.12', excluded: true }    // slowest (excluded)
        ]
      }
    ]
  },
  wca: {
    '333': [
      { 
        rank: 1, 
        name: 'Alice Johnson', 
        wcaId: '2020JOHN01', 
        time: '8.56', 
        average: '10.78', 
        competition: 'Texas Championship 2024', 
        solves: [
          { time: '10.89', excluded: false },
          { time: '10.67', excluded: false },
          { time: '10.78', excluded: false },
          { time: '8.56', excluded: true },   // fastest (excluded)
          { time: '12.45', excluded: true }   // slowest (excluded)
        ]
      },
      { 
        rank: 2, 
        name: 'Bob Smith', 
        wcaId: '2019SMIT02', 
        time: '9.34', 
        average: '11.45', 
        competition: 'Austin Open 2024', 
        solves: [
          { time: '11.67', excluded: false },
          { time: '11.23', excluded: false },
          { time: '11.45', excluded: false },
          { time: '9.34', excluded: true },   // fastest (excluded)
          { time: '13.78', excluded: true }   // slowest (excluded)
        ]
      },
      { 
        rank: 3, 
        name: 'Carol Davis', 
        wcaId: '2021DAVI03', 
        time: '10.12', 
        average: '12.23', 
        competition: 'Houston Cube Day 2024', 
        solves: [
          { time: '12.45', excluded: false },
          { time: '12.01', excluded: false },
          { time: '12.23', excluded: false },
          { time: '10.12', excluded: true },  // fastest (excluded)
          { time: '14.89', excluded: true }   // slowest (excluded)
        ]
      }
    ],
    '222': [
      { 
        rank: 1, 
        name: 'Bob Smith', 
        wcaId: '2019SMIT02', 
        time: '2.78', 
        average: '3.45', 
        competition: 'Austin Open 2024', 
        solves: [
          { time: '3.56', excluded: false },
          { time: '3.34', excluded: false },
          { time: '3.45', excluded: false },
          { time: '2.78', excluded: true },   // fastest (excluded)
          { time: '4.23', excluded: true }    // slowest (excluded)
        ]
      },
      { 
        rank: 2, 
        name: 'Alice Johnson', 
        wcaId: '2020JOHN01', 
        time: '3.12', 
        average: '3.89', 
        competition: 'Texas Championship 2024', 
        solves: [
          { time: '3.78', excluded: false },
          { time: '4.01', excluded: false },
          { time: '3.89', excluded: false },
          { time: '3.12', excluded: true },   // fastest (excluded)
          { time: '4.67', excluded: true }    // slowest (excluded)
        ]
      }
    ]
  }
}

const getLeaderboardData = (masterTabId, eventId) => {
  return mockLeaderboards[masterTabId]?.[eventId] || []
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