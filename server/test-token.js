// test-token.js
const jwt = require('jsonwebtoken')
const SECRET = 'your_super_secret_key'

const payload = {
  id: 1,
  email: "alice@example.com",
  iat: Math.floor(Date.now() / 1000),
  exp: Math.floor(Date.now() / 1000) + (60 * 60) // 1 hour from now
}

const newToken = jwt.sign(payload, SECRET)
console.log('New token:', newToken)
