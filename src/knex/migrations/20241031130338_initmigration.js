/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('rows', function(table) {
    table.increments('id');
    table.string('date');
    table.string('boxDeliveryAndStorageExpr');
    table.string('boxDeliveryBase');
    table.string('boxDeliveryLiter');
    table.string('boxStorageBase');
    table.string('boxStorageLiter');
    table.string('warehouseName');
});
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('rows');
};

