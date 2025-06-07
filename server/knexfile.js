require('dotenv').config(); // <--- Add this at the top

module.exports = {
  development: {
    client: 'postgresql',
    connection: process.env.DATABASE_URL, // <--- Use env for dev too
    migrations: {
      tableName: 'knex_migrations'
    }
  },
  production: {
    client: 'postgresql',
    connection: process.env.DATABASE_URL,
    migrations: {
      tableName: 'knex_migrations'
    },
    ssl: { rejectUnauthorized: false } // Required for Heroku
  }
};
