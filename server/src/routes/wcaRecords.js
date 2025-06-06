const express = require('express');
const knex = require('../db');
const router = express.Router();
const { syncAllUsers } = require('../wcaSync')

// GET /api/wca-records/last-sync
router.get('/last-sync', async (req, res) => {
  try {
    // This gets the latest updated_at value from wca_records
    const result = await knex('wca_records')
      .max('updated_at as lastSync')
      .first();
    // result.lastSync will be null if there are no records yet
    return res.json({ lastSync: result.lastSync });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not get last sync time' });
  }
});

// POST /api/wca-records/sync (should be admin-only in production)
//disabled since there are no admin-only parts
// router.post('/sync', async (req, res) => {
//   try {
//     await syncAllUsers()
//     res.json({ status: 'ok', message: 'WCA records synced.' })
//   } catch (err) {
//     res.status(500).json({ error: 'Sync failed', details: err.message })
//   }
// })

// write last !!!
// GET /api/wca-records/:event_code
router.get('/:event_code', async (req, res) => {
  const { event_code } = req.params;
  try {
    const records = await knex('wca_records')
      .where({ event_code })
      .join('users', 'wca_records.user_id', 'users.id')
      .select(
        'wca_records.best_single_ms',
        'wca_records.best_average_ms',
        'wca_records.updated_at',
        'wca_records.user_id',
        'wca_records.wca_id',
        'users.name'
      );
    // Map to leaderboard format
    const singles = records
      .filter(r => r.best_single_ms !== null)
      .map(r => ({
        userId: r.user_id,
        name: r.name,
        wcaId: r.wca_id,
        time: (r.best_single_ms / 1000).toFixed(2),
        updated_at: r.updated_at,
      }));
    const averages = records
      .filter(r => r.best_average_ms !== null)
      .map(r => ({
        userId: r.user_id,
        name: r.name,
        wcaId: r.wca_id,
        time: (r.best_average_ms / 1000).toFixed(2),
        updated_at: r.updated_at,
      }));

    res.json({ records: { Single: singles, Average: averages } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch WCA records' });
  }
});






module.exports = router;
