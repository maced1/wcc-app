exports.up = function(knex) {
  return knex.schema
    .createTable('users', (table) => {
      table.increments('id').primary();
      table.string('username').unique().notNullable();
      table.string('password').notNullable();
    })
    .createTable('times', (table) => {
      table.increments('id').primary();
      table.integer('user_id').unsigned().references('users.id');
      table.float('time').notNullable();
      table.timestamps(true, true);
    });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('times').dropTableIfExists('users');
};

