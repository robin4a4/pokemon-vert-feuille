/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = (knex) => knex.schema
    .alterTable("grids", (table) => {
        table.timestamp("created_at")
        table.timestamp("updated_at")
    });

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = (knex) => knex.schema.alterTable("grids", (table) => {
    table.dropColumn("created_at");
    table.dropColumn("updated_at");
});
