import { knex as setupKnex, Knex } from 'knex'

const config: Knex.Config = {
  client: 'sqlite3',
  connection: {
    filename: './db/app.sqlite',
  },
  useNullAsDefault: true,
  migrations: {
    extension: 'ts',
    directory: './db/migrations/',
  },
}

export const knex = setupKnex(config)

export { config }
