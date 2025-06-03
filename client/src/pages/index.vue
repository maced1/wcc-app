<template>
  <v-container>
    <!-- <h2>{{ selectedEvent.name }} Leaderboard</h2> -->
    <v-data-table
      :headers="headers"
      :items="leaderboard"
      class="elevation-1"
    ></v-data-table>
  </v-container>
</template>

<script>
// export default {
//   name: 'Home',
//   props: ['selectedEvent'],
//   data() {
//     return {
//       headers: [
//         { text: 'Rank', value: 'rank' },
//         { text: 'User', value: 'user' },
//         { text: 'Best Time (s)', value: 'time' },
//       ],
//       leaderboard: [],
//     }
//   },
//   watch: {
//     selectedEvent: {
//       immediate: true,
//       handler(newEvent) {
//         this.fetchLeaderboard(newEvent.code)
//       }
//     }
//   },
//   methods: {
//     fetchLeaderboard(eventCode) {
//       // For now, use mock data — eventually fetch from your backend
//       const sample = {
//         '333': [
//           { rank: 1, user: 'Alice', time: 6.34 },
//           { rank: 2, user: 'Bob', time: 7.12 },
//         ],
//         '444': [
//           { rank: 1, user: 'Alice', time: 25.14 },
//           { rank: 2, user: 'Charlie', time: 27.88 },
//         ]
//       }
//       this.leaderboard = sample[eventCode] || []
//     }
//   }
// }
</script>
