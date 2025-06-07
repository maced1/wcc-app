// db.js
const knex = require('knex');
const knexfile = require('../knexfile');

const environment = process.env.NODE_ENV || 'development';
const config = knexfile[environment];

if (!config || !config.client) {
  throw new Error(`Knex config missing or invalid for environment: ${environment}`);
}

module.exports = knex(config);
