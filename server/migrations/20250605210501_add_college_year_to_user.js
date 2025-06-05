exports.up = function(knex) {
  return knex.schema.table('users', function(table) {
    table.string('college_year') // You can also use .enum() if you want to restrict values
  })
}

exports.down = function(knex) {
  return knex.schema.table('users', function(table) {
    table.dropColumn('college_year')
  })
}
