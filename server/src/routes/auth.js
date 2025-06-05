// server/routes/auth.js
const jwt = require('jsonwebtoken')

const SECRET = process.env.JWT_SECRET || 'your_super_secret_key'

const authenticate = require('../middleware/auth')
router.get('/private-data', authenticate, (req, res) => {
  res.json({ secret: `Hello ${req.user.email}` })
})

router.post('/login', async (req, res) => {
  const { email, password } = req.body
  const user = await knex('users').where({ email }).first()
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: 'Invalid credentials' })
  }

  const token = jwt.sign({ id: user.id, email: user.email }, SECRET, { expiresIn: '1h' })
  res.json({ token, user })
})
