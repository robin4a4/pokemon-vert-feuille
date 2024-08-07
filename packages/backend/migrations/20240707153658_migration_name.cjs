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
      table.string("salt", 255).notNullable();
    })
    .createTable("boards", function (table) {
      table.increments("id").primary();
      table.string("name", 1000).notNullable();
      table.string("grid").notNullable();
      table.integer("userId").references("users.id");
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTableIfExists("boards").dropTableIfExists("users");
}
