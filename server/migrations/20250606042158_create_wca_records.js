// migrations/20240605_create_wca_records.js
exports.up = function(knex) {
  return knex.schema.createTable('wca_records', function(table) {
    table.increments('id').primary()
    table.integer('user_id').unsigned().notNullable().references('id').inTable('users')
    table.string('wca_id').notNullable()
    table.string('event_code').notNullable()
    table.integer('best_single_ms')
    table.integer('best_average_ms')
    table.datetime('updated_at').defaultTo(knex.fn.now())
    table.unique(['user_id', 'event_code']) // Only one record per event per user
  })
}

exports.down = function(knex) {
  return knex.schema.dropTable('wca_records')
}
