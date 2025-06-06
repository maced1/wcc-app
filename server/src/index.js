// wcc-app/server/src/index.js
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') })

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser'); // or use express.json()
const knex = require('./db');               // your configured Knex instance

const usersRouter = require('./routes/users');
const recordsRouter = require('./routes/personalRecords');


const app = express();
app.use(cors());
app.use(bodyParser.json()); // parse JSON bodies

// MOUNT the users router at /api/users
// This means POST /api/users/register → will run whatever is in routes/users.js
app.use('/api/users', usersRouter);

// If you have other routers, e.g. personal records:
app.use('/api/records', recordsRouter);

const PORT = process.env.PORT || 8080;

// >>> Add this debug middleware at the very end:
app.use((req, res, next) => {
  console.log(`Unhandled request: [${req.method}] ${req.originalUrl}`);
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
