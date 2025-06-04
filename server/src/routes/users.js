// app/server/src/routes/users.js
const express = require('express');
const bcrypt = require('bcrypt');
const knex = require('../db');

const router = express.Router();

// POST /api/users/register
router.post('/register', async (req, res) => {
  const { name, email, password, wca_id } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required.' });
  }

  try {
    // 1. Check if email already exists
    const existing = await knex('users').where({ email }).first();
    if (existing) {
      return res.status(409).json({ error: 'Email already in use.' });
    }

    // 2. Hash the password
    const hashed = await bcrypt.hash(password, 10);

    // 3. Insert new user
    const [newUserId] = await knex('users').insert({
      name,
      email,
      password: hashed,
      wca_id: wca_id || null
    });

    // 4. Return created user (omit password)
    const createdUser = await knex('users')
      .select('id', 'name', 'email', 'wca_id', 'created_at')
      .where({ id: newUserId })
      .first();

    return res.status(201).json({ user: createdUser });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error while registering user.' });
  }
});

// POST /api/users/login (basic example)
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  try {
    const user = await knex('users').where({ email }).first();
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    // For now, just return user info (in practice, issue a JWT or session)
    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      wca_id: user.wca_id,
    };
    return res.json({ user: safeUser });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error while logging in.' });
  }
});

// GET /api/users/:user_id/records
router.get('/:user_id/records', async (req, res) => {
  const { user_id } = req.params;
  try {
    const user = await knex('users').where({ id: user_id }).first();
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }
    const records = await knex('personal_records')
      .where({ user_id })
      .select('id', 'event_code', 'best_time_ms', 'created_at')
      .orderBy('event_code', 'asc');
    return res.json({ records });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error fetching user records.' });
  }
});


module.exports = router;
