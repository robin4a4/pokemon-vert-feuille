/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = (knex) => knex.schema
    .createTable("users", (table) => {
      table.increments("id").primary();
      table.string("username", 255).notNullable().unique();
      table.string("password", 255).notNullable();
      table.string("salt", 255).notNullable();
      table.timestamp("created_at").defaultTo(knex.fn.now());
        table.timestamp("updated_at").defaultTo(knex.fn.now())
    })
    .createTable("grids", (table) => {
      table.increments("id").primary();
      table.string("name", 1000).notNullable();
      table.string("grid").notNullable();
      table.integer("userId").references("users.id");
    });

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = (knex) => knex.schema.dropTableIfExists("grids").dropTableIfExists("users")
