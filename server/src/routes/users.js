// app/server/src/routes/users.js
const express = require('express');
const bcrypt = require('bcrypt');
const knex = require('../db');
const router = express.Router();
//const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key'

const verifyToken = require('../middleware/auth')

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
      wca_id: wca_id || null,
      created_at: knex.fn.now()
    });

    // 4. Return created user (omit password)
    const createdUser = await knex('users')
      .select('id', 'name', 'email', 'wca_id', 'created_at')
      .where({ id: newUserId })
      .first();

    return res.status(201).json({ user: createdUser });
  } catch (err) {
    console.error(`Error updating user with ID ${user_id}:`, err);
    console.error(err);
    return res.status(500).json({ error: 'Server error while registering user.' });
  }
});

// POST /api/users/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body

  try {
    const user = await knex('users').where({ email }).first()
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    const passwordMatch = await bcrypt.compare(password, user.password)
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    // ✅ Create JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '1h' }
    )

    // ✅ Return token and user info
    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        wca_id: user.wca_id,
        created_at: user.created_at
      }
    })

  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error during login' })
  }
});

// GET /api/users/:user_id - Fetches details of a user by their ID
router.get('/:user_id', async (req, res) => {
  const { user_id } = req.params;
  try {
    // Get single user row (no array wrapping)
    const user = await knex('users')
      .where({ id: user_id })
      .select('id', 'name', 'email', 'wca_id', 'created_at', 'college_year')
      .first();

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    return res.json(user); // Return plain object
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error fetching user data.' });
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

// PUT /api/users/:user_id
router.put('/:user_id', verifyToken, async (req, res) => {
  const { user_id } = req.params
  const { name, email, college_year, wca_id } = req.body;

  if (!user_id) {
    return res.status(400).json({ error: 'User ID is required.' });
  }

  try {
    // Optional: Check if the email is already used by another user
    const existing = await knex('users')
      .where({ email })
      .andWhereNot({ id: user_id })
      .first();

    if (existing) {
      return res.status(409).json({ error: 'Email already in use by another user.' });
    }

    // Update user
    await knex('users')
      .where({ id: user_id })
      .update({
        name,
        email,
        college_year,
        wca_id,
        updated_at: knex.fn.now()
      });

    // Fetch and return updated user
    const updatedUser = await knex('users')
      .select('id', 'name', 'email', 'college_year', 'wca_id', 'updated_at')
      .where({ id: user_id })
      .first();

    return res.status(200).json({ user: updatedUser });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error while updating user.' });
  }
});


module.exports = router;
