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
    client: 'pg',
    connection: {
      connectionString: process.env.DATABASE_URL + '?sslmode=require',
      ssl: { rejectUnauthorized: false },
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }
};
