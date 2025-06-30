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
import { useLeaderboards } from '@/composables/useLeaderboards'

const {
  // State
  activeMasterTab,
  activeEventTab,
  lastWcaSync,
  
  // Constants
  masterTabs,
  wcaEvents,
  
  // Functions
  formatDate,
  formatTime,
  formatResultTime,
  getTableHeaders,
  getLeaderboardData,
  getCompetitorCount,
  getRankColor
} = useLeaderboards()
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
