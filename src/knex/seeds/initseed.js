/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('rows').del()

  // await knex('rows').insert([
  //   {
  //     date: '2024-10-20',
  //     boxDeliveryAndStorageExpr: "160",
  //     boxDeliveryBase: "48",
  //     boxDeliveryLiter: "11,2",
  //     boxStorageBase: "0,1",
  //     boxStorageLiter: "0,1",
  //     warehouseName: "Коледино"
  //   },
  //   {
  //     date: '2024-10-21',
  //     boxDeliveryAndStorageExpr: "170",
  //     boxDeliveryBase: "58",
  //     boxDeliveryLiter: "21,2",
  //     boxStorageBase: "0,2",
  //     boxStorageLiter: "0,2",
  //     warehouseName: "Коледино2"
  //   }
  // ]);
  
};
