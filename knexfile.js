require('dotenv').config();
module.exports = {
  development: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    searchPath: ['knex', 'public'],
    migrations: {
      directory: './src/knex/migrations',
    },
    seeds: { directory: './src/knex/seeds' },
  },

  testing: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    searchPath: ['knex', 'public'],
    migrations: {
      directory: './src/knex/migrations',
    },
    seeds: { directory: './src/knex/seeds' },
  },

  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    searchPath: ['knex', 'public'],
    migrations: {
      directory: './src/knex/migrations',
    },
    seeds: { directory: './src/knex/seeds' },
  },
};