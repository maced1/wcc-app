// wcc-app/server/src/index.js
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') })

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser'); // or use express.json()
const knex = require('./db');               // your configured Knex instance
const path = require('path');

const usersRouter = require('./routes/users');
const recordsRouter = require('./routes/personalRecords');
const wcaRecordsRouter = require('./routes/wcaRecords');


const app = express();
app.use(cors());
app.use(bodyParser.json()); // parse JSON bodies

//prepare for deployment
app.use(express.static(path.join(__dirname, '../../client/dist')));

// Sync every day at midnight
const cron = require('node-cron');
const { syncAllUsers } = require('./wcaSync');

cron.schedule('0 0 * * *', async () => {
  await syncAllUsers();
});

// MOUNT the users router at /api/users
// This means POST /api/users/register → will run whatever is in routes/users.js
app.use('/api/users', usersRouter);

// If you have other routers, e.g. personal records:
app.use('/api/records', recordsRouter);

app.use('/api/wca-records', wcaRecordsRouter);


// Catch-all route for Vue Router (SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// >>> Add this debug middleware at the very end:
app.use((req, res, next) => {
  console.log(`Unhandled request: [${req.method}] ${req.originalUrl}`);
  res.status(404).json({ error: 'Route not found' });
});
