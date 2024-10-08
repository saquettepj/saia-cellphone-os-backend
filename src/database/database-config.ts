/* eslint-disable @typescript-eslint/no-explicit-any */
import { knex as setupKnex, Knex } from "knex"
import { Database } from "./types/knex-tables-types"
import { env } from "../env"

/* export const config = {
  client: 'pg',
  connection: {
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'postgres',
    database: 'db-postgres-sales-system'
  },
  useNullAsDefault: true,
  migrations: {
    extensions: 'ts',
    directory: './migrations'
  },
  seeds: {
    directory: './seeds'
  }
} */

export const config = {
  client: 'pg',
  connection: {
    host: env.DB_HOST,
    port: env.DB_PORT,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_NAME,
  },
  useNullAsDefault: true,
  migrations: {
    extensions: 'ts',
    directory: './migrations'
  },
  seeds: {
    directory: './seeds'
  }
};

export const knex = setupKnex(config) as Knex<Database>