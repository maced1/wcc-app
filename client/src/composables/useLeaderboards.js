// composables/useLeaderboards.js
import { ref, onMounted } from 'vue'
import { getLeaderboardRecords, getWcaLeaderboardRecords, getWcaLastSync } from '@/services/api'

export function useLeaderboards() {
  const activeMasterTab = ref('personal')
  const activeEventTab = ref({
    personal: '333',
    mock: '333',
    wca: '333'
  })

  const liveLeaderboards = ref({})
  const wcaLeaderboards = ref({})
  const lastWcaSync = ref(null)

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
      id: '333bf',
      name: '3x3 Blindfolded',
      icon: 'mdi-eye-off'
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
      name: 'Square-1',
      icon: 'mdi-square-off'
    },
    {
      id: 'minx',
      name: 'Megaminx',
      icon: 'mdi-hexagon-outline'
    },
    {
      id: '444bf',
      name: '4x4 Blindfolded',
      icon: 'mdi-eye-off-outline'
    },
    {
      id: '555bf',
      name: '5x5 Blindfolded',
      icon: 'mdi-eye-off'
    }
  ]

  // Date formatting functions
  const formatDate = (utcString) => {
    if (!utcString) return '';
    const date = new Date(utcString);
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

  const formatResultTime = (seconds) => {
    if (seconds == null || seconds === '' || isNaN(seconds)) return ''
    seconds = Number(seconds)
    if (seconds < 60) {
      return seconds.toFixed(2)
    }
    const minutes = Math.floor(seconds / 60)
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
        { title: 'Last Updated', key: 'single_date', sortable: true, width: '130px' },
        { title: 'Average', key: 'average', sortable: true, width: '120px' },
        { title: 'Last Updated', key: 'average_date', sortable: true, width: '130px' }
      )
    }
    
    return baseHeaders
  }

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

    // Merge and sort
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

  // Data loading
  const loadData = async () => {
    try {
      // Load WCA sync info
      const { data: syncData } = await getWcaLastSync()
      lastWcaSync.value = syncData.lastSync

      // Load data for all events
      for (const event of wcaEvents) {
        // Load personal records
        const { data: personalData } = await getLeaderboardRecords(event.id)
        const personalSingle = personalData.records.Single || []
        const personalAverage = personalData.records.Average || []

        personalSingle.sort((a, b) => a.time - b.time)
        personalAverage.sort((a, b) => a.time - b.time)

        liveLeaderboards.value[event.id] = {
          single: personalSingle,
          average: personalAverage
        }

        // Load WCA records
        const { data: wcaData } = await getWcaLeaderboardRecords(event.id)
        const wcaSingle = wcaData.records.Single || []
        const wcaAverage = wcaData.records.Average || []

        wcaSingle.sort((a, b) => a.time - b.time)
        wcaAverage.sort((a, b) => a.time - b.time)

        wcaLeaderboards.value[event.id] = {
          single: wcaSingle,
          average: wcaAverage
        }
      }
    } catch (error) {
      console.error('Error loading leaderboard data:', error)
    }
  }

  onMounted(loadData)

  return {
    // State
    activeMasterTab,
    activeEventTab,
    liveLeaderboards,
    wcaLeaderboards,
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
    getRankColor,
    loadData
  }
}
