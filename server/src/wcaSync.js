const axios = require('axios')
const knex = require('./db') // adjust path to your knex instance

async function syncWcaRecordsForUser(user) {
  if (!user.wca_id) return
  const url = `https://raw.githubusercontent.com/robiningelbrecht/wca-rest-api/master/api/persons/${user.wca_id}.json`
  try {
    const { data } = await axios.get(url)
    const singles = data.rank?.singles || []
    const averages = data.rank?.averages || []

    if (singles.length === 0 && averages.length === 0) {
      console.warn(`No WCA records for ${user.wca_id}`)
      return
    }

    // Store all singles
    for (const single of singles) {
      await knex('wca_records')
        .insert({
          user_id: user.id,
          wca_id: user.wca_id,
          event_code: single.eventId,
          best_single_ms: single.best ? single.best * 10 : null,  // <-- here!
          best_average_ms: null,
          updated_at: knex.fn.now()
        })
        .onConflict(['user_id', 'event_code'])
        .merge({
          best_single_ms: single.best ? single.best * 10 : null,
          updated_at: knex.fn.now(),
          wca_id: user.wca_id
        })
    }

    // Store all averages
    for (const avg of averages) {
      await knex('wca_records')
        .insert({
          user_id: user.id,
          wca_id: user.wca_id,
          event_code: avg.eventId,
          best_single_ms: null,
          best_average_ms: avg.best ? avg.best * 10 : null,  // gotten as centiseconds, convert to ms
          updated_at: knex.fn.now()
        })
        .onConflict(['user_id', 'event_code'])
        .merge({
          best_average_ms: avg.best ? avg.best * 10 : null,
          updated_at: knex.fn.now(),
          wca_id: user.wca_id
        })
    }

    console.log(`Synced WCA records for ${user.wca_id}`)
  } catch (err) {
    if (err.response && err.response.status === 404) {
      console.warn(`WCA ID ${user.wca_id} not found. Skipping.`)
    } else {
      console.error(`Failed to sync WCA ID ${user.wca_id}:`, err.message)
    }
  }
}

// To sync all users with a WCA ID
async function syncAllUsers() {
  const users = await knex('users').whereNotNull('wca_id');
  console.log('Found users:', users.map(u => u.wca_id));
  for (const user of users) {
    console.log(`Attempting sync for ${user.wca_id}`);
    await syncWcaRecordsForUser(user);
  }
  // Remove process.exit(0) from here
}

// Run if this script is called directly (node wcaSync.js)
if (require.main === module) {
  syncAllUsers().then(() => process.exit(0));
}



module.exports = { syncAllUsers };
