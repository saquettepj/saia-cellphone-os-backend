import { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("products", (table) => {
    table.uuid('uuid').primary().defaultTo(knex.fn.uuid());
    table.text("name").notNullable();
    table.decimal("price").notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  })
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("products")
}

