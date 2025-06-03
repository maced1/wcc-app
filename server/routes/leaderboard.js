const express = require('express');
const jwt = require('jsonwebtoken');
const knex = require('knex')(require('../knexfile').development);
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token missing' });

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.userId = payload.userId;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}

router.post('/submit', authenticate, async (req, res) => {
  const { time } = req.body;
  await knex('times').insert({ user_id: req.userId, time });
  res.json({ message: 'Time submitted' });
});

router.get('/', async (req, res) => {
  const times = await knex('times')
    .join('users', 'users.id', '=', 'times.user_id')
    .select('users.username', 'times.time')
    .orderBy('time');
  res.json(times);
});

module.exports = router;
