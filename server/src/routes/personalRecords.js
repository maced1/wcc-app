// app/server/src/routes/personalRecords.js
const express = require('express');
const knex = require('../db');
const router = express.Router();

const authenticate = require('../middleware/auth')

// POST /api/records/:user_id
router.post('/user/:user_id', authenticate, async (req, res) => {
  console.log('POST /user/:user_id route hit')
  const { user_id } = req.params;
  const { event_code, best_time_ms, record_type } = req.body;

  if (!event_code || best_time_ms == null || !record_type) {
    return res.status(400).json({ error: 'event_code, best_time_ms, and record_type are required.' });
  }

  if (!['Single', 'Average'].includes(record_type)) {
    return res.status(400).json({ error: 'Invalid record_type. Must be "Single" or "Average".' });
  }

  try {
    // Verify user exists
    const user = await knex('users').where({ id: user_id }).first();
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    // Check if record already exists
    const existingRecord = await knex('personal_records')
      .where({ user_id, event_code, record_type })
      .first();

    let record;

    if (existingRecord) {
      // Update existing record
      await knex('personal_records')
        .where({ id: existingRecord.id })
        .update({ best_time_ms, updated_at: knex.fn.now() });

      record = await knex('personal_records').where({ id: existingRecord.id }).first();
    } else {
      // Insert new record
      const [id] = await knex('personal_records').insert({
        user_id,
        event_code,
        best_time_ms,
        record_type,
        created_at: knex.fn.now()
      });

      record = await knex('personal_records').where({ id }).first();
    }

    return res.status(200).json({ record });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error when saving personal record.' });
  }
});

// // GET /api/records/:event_code
// // Returns all records for a specific event, ordered by best_time_ms ascending
// router.get('/:event_code', async (req, res) => {
//   const { event_code } = req.params;
//   try {
//     const records = await knex('personal_records')
//       .where({ event_code })
//       .join('users', 'personal_records.user_id', 'users.id')
//       .select(
//         'personal_records.id',
//         'personal_records.best_time_ms',
//         'users.id as user_id',
//         'users.name',
//         'users.wca_id'
//       )
//       .orderBy('personal_records.best_time_ms', 'asc');
//     return res.json({ records });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ error: 'Server error fetching records.' });
//   }
// });

// GET /api/records/event/:event_code
router.get('/event/:event_code', async (req, res) => {
  const { event_code } = req.params;

  try {
    const records = await knex('personal_records')
      .where({ event_code })
      .join('users', 'personal_records.user_id', 'users.id')
      .select(
        'personal_records.id',
        'personal_records.best_time_ms',
        'personal_records.record_type',
        'personal_records.updated_at',
        'users.id as user_id',
        'users.name',
        'users.wca_id'
      );

    // Group results into { Single, Average }
    const grouped = {
      Single: [],
      Average: []
    };

    records.forEach((r) => {
      grouped[r.record_type].push({
        userId: r.user_id,
        name: r.name,
        wcaId: r.wca_id,
        time: (r.best_time_ms / 1000).toFixed(2), // Convert ms to s
        updated_at: r.updated_at
      });
    });

    return res.json({ records: grouped });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error fetching leaderboard.' });
  }
});


module.exports = router;
