/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .createTable("users", function (table) {
      table.increments("id").primary();
      table.string("username", 255).notNullable();
      table.string("password", 255).notNullable();
    })
    .createTable("boards", function (table) {
      table.increments("id").primary();
      table.string("name", 1000).notNullable();
      table.integer("width").notNullable();
      table.integer("height").notNullable();
      table.integer("userId").references("users.id");
    })
    .createTable("cells", function (table) {
      table.increments("id").primary();
      table.string("name", 1000).notNullable();
      table.integer("x").notNullable();
      table.integer("y").notNullable();
      table.integer("boardId").references("boards.id");
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {};
