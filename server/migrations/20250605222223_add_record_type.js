exports.up = function(knex) {
  return knex.schema.table('personal_records', function(table) {
    table.string('record_type').notNullable().defaultTo('Single') // single or average
  })
}

exports.down = function(knex) {
  return knex.schema.table('personal_records', function(table) {
    table.dropColumn('record_type')
  })
}