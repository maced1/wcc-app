// app/server/migrations/20250604_create_personal_records_table.js

/**
 * Create a "personal_records" table with:
 *  - id (autoincrement primary key)
 *  - user_id (foreign key → users.id)
 *  - event_code (e.g. '333', '444', etc.)
 *  - best_time_ms (integer for time in milliseconds)
 *  - created_at / updated_at timestamps
 */
exports.up = function(knex) {
  return knex.schema.createTable('personal_records', (table) => {
    table.increments('id').primary();
    table
      .integer('user_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE');
    table.string('event_code').notNullable();
    table.integer('best_time_ms').notNullable();
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('personal_records');
};
