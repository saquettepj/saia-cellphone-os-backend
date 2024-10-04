import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
    await knex("products").del();

    await knex("products").insert([
        { name: "Celular 1", price: 199.9 },
        { name: "Celular 2", price: 299.9 },
        { name: "Celular 3", price: 399.9 }
    ]);
};
