// app/server/migrations/20250604_create_users_table.js

/**
 * Create a "users" table with:
 *  - id (autoincrement primary key)
 *  - name (string)
 *  - email (unique string, not nullable)
 *  - password (string, not nullable)
 *  - wca_id (string, nullable)
 *  - created_at / updated_at timestamps
 */
exports.up = function(knex) {
  return knex.schema.createTable('users', (table) => {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.string('email').notNullable().unique();
    table.string('password').notNullable();
    table.string('wca_id'); // optional WCA ID
    table.timestamps(true, true); // adds created_at & updated_at
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('users');
};
