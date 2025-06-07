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
    connection: {
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    },
    migrations: {
      directory: './migrations'
    }
  }
};
