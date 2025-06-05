// app/server/src/routes/personalRecords.js
const express = require('express');
const knex = require('../db');

const router = express.Router();

const verifyToken = require('../middleware/auth')

// POST /api/records
// Body: { user_id, event_code, best_time_ms }
router.post('/', verifyToken, async (req, res) => {
  const { user_id, event_code, best_time_ms } = req.body;
  if (!user_id || !event_code || best_time_ms == null) {
    return res.status(400).json({ error: 'user_id, event_code, and best_time_ms are required.' });
  }

  try {
    // Verify user exists
    const user = await knex('users').where({ id: user_id }).first();
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    // Insert record
    const [recordId] = await knex('personal_records').insert({
      user_id,
      event_code,
      best_time_ms
    });

    const newRecord = await knex('personal_records').where({ id: recordId }).first();
    return res.status(201).json({ record: newRecord });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error when inserting personal record.' });
  }
});

// GET /api/records/:event_code
// Returns all records for a specific event, ordered by best_time_ms ascending
router.get('/:event_code', async (req, res) => {
  const { event_code } = req.params;
  try {
    const records = await knex('personal_records')
      .where({ event_code })
      .join('users', 'personal_records.user_id', 'users.id')
      .select(
        'personal_records.id',
        'personal_records.best_time_ms',
        'users.id as user_id',
        'users.name',
        'users.wca_id'
      )
      .orderBy('personal_records.best_time_ms', 'asc');
    return res.json({ records });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error fetching records.' });
  }
});

module.exports = router;
