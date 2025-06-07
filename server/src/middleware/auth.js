// server/middleware/auth.js
const jwt = require('jsonwebtoken')
const SECRET = process.env.JWT_SECRET || 'your_super_secret_key'

function authenticate(req, res, next) {
  // console.log('JWT_SECRET from env:', process.env.JWT_SECRET)
  // console.log('SECRET being used:', SECRET)
  
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    //console.log('Missing or invalid auth header format')
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const token = authHeader.split(' ')[1]
  // console.log('Raw auth header:', req.headers.authorization)
  // console.log('Token from header:', token)
  
  try {
    const decoded = jwt.verify(token, SECRET)
    //console.log('Token decoded successfully:', decoded)
    req.user = decoded
    next()
  } catch (err) {
    console.log('JWT verification error:', err.message)
    console.log('Error name:', err.name)
    return res.status(401).json({ error: 'Invalid or expired token' })
  }
}

module.exports = authenticate
