/* eslint-disable @typescript-eslint/no-explicit-any */
import { knex as setupKnex } from "knex";

/* export const config = {
  client: 'sqlite3',
  useNullAsDefault: true,
  pool: {
    afterCreate: (connection: any, done: any) => {
      connection.run("PRAGMA foreign_keys = ON");
      done();
    }
  },
  connection: {
    filename: "./tmp/database.db"
  },
  migrations: {
    extensions: "ts",
    directory: "./migrations"
  },
  seeds: {
    directory: "./seeds"
  }
} */

export const config = {
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
};

export const knex = setupKnex(config)