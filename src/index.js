require('dotenv').config();
const express = require('express');
const knex = require('./knex/knex.js');
const gsp = require('./gsp/gsp.js');
const axios = require('axios');
const app = express();
const PORT = 3000;
app.use(express.json());
app.post('/', function (req, res) {
    console.log(req.body.name)
    res.end();
})
app.listen(PORT, () => {
  console.log("Server listening on PORT", PORT);

  // setting repeating wbdata process (every hour)
  let ms_delay = 1000 * Number(process.env.SECONDS_BETWEEN_REQUESTS)
  const interval = setInterval(() => {
    wbdata_process()
  }, ms_delay)
  console.log(`wbdata handler has been started`);
  
  // first launch wbdata process
  wbdata_process()
})




/**
 * Load data from WB - save to postgreSQL, save to Google Spreadsheets
 */
async function wbdata_process(){

  let current_date = new Date().toISOString().split('T')[0]
  console.log(`Retrieving WB data per day: ${current_date}`)

  let data_per_day = await get_wb_data(current_date)

  console.log(`Updating database...`)
  await update_data_in_database(current_date, data_per_day)

  console.log("Settings data to Google Spreadsheets...")
  await set_data_to_google_spreadsheets()
}


/**
 * Retrieving data from WB
 * @param {string} current_date date in format YYYY-MM-DD
 * @returns {Promise<Array.<Object>>} array of wildberries data
 */
async function get_wb_data(current_date){

  const config = {
    headers: { 
      Authorization: `Bearer ${process.env.WB_TOKEN}` 
    },
    params: {
      date: current_date
    }
  };

  // @ts-ignore
  let res = await axios.get(process.env.WB_URL, config).catch((/** @type {any} */ error) => {
    console.log("Error get wb request: ", error)
    return false;
  });

  if (res && res.status === 200){
    let data = res.data.response.data.warehouseList
    console.log(data[0])
    return data
  } else {
    return []
  }

}



/**
 * 
 * @param {string} current_date current date today
 * @param {Object[]} data_per_day data per one day
 */
async function update_data_in_database(current_date, data_per_day){

  // remove data from PostgreSQL
  let rows_deleted = await knex('rows').del().where({
    date: current_date
  })

  // inserting all wb_data per day
  for (const one_row of data_per_day){
    
    // copying one row json, adding field "date"
    let row_to_insert = JSON.parse(JSON.stringify(one_row))
    row_to_insert['date'] = current_date
    
    // inserting one row
    let successfully_inserted = await knex('rows').insert(row_to_insert)
    .then(res => { return true })
    .catch(error => { return false });
  }  
}


/**
 * update Google Spreadsheets with data from PostgreSQL
 */
async function set_data_to_google_spreadsheets(){

  const SS_IDS = String(process.env.SS_IDS).split(' ');
  const SHEET_NAME = process.env.SS_SHEET_NAME

  // get data from PostgreSQL
  let data = await knex.select('*').from('rows').orderBy('boxDeliveryAndStorageExpr', 'asc')

  // update Google Spreadsheets
  if (data.length){
    for (let ss_id of SS_IDS){
      console.log(`Loading data to spreadsheet: ${ss_id}`)
      await clear_sheet_data(ss_id, String(SHEET_NAME))
      await set_sheet_data(ss_id, String(SHEET_NAME), data)
    }  
  }

}

/**
 * Clear One Google SpreadSheet data
 * @param {string} ss_id Google SpreadsheetID
 * @param {string} SHEET_NAME Google SheetName
 */
async function clear_sheet_data(ss_id, SHEET_NAME){
  let first_row = process.env.SS_SHEET_FIRST_ROW;
  let data_range = `'${SHEET_NAME}'!A${first_row}:H`
  await gsp.clear_sheet_data(ss_id, data_range)
}

/**
 * Updating One Google SpreadSheet
 * @param {string} ss_id Google SpreadsheetID
 * @param {string} SHEET_NAME Google SheetName
 * @param {Object[]} data array of wildberries data
 * @param {string} data.id row id PostgreSQL
 * @param {string} data.date date in format YYYY-MM-DD
 * @param {string} data.boxDeliveryAndStorageExpr
 * @param {string} data.boxDeliveryBase
 * @param {string} data.boxDeliveryLiter
 * @param {string} data.boxStorageBase
 * @param {string} data.boxStorageLiter
 * @param {string} data.warehouseName
 */
async function set_sheet_data(ss_id, SHEET_NAME, data){
  let first_row = process.env.SS_SHEET_FIRST_ROW;
  let last_row  = data.length + String(process.env.SS_SHEET_FIRST_ROW);
  let data_range = `'${SHEET_NAME}'!A${first_row}:H${last_row}`

  let values = []
  for (let row of data){
    let str = [
      row.id,
      row.date,
      row.boxDeliveryAndStorageExpr,
      row.boxDeliveryBase,
      row.boxDeliveryLiter,
      row.boxStorageBase,
      row.boxStorageLiter,
      row.warehouseName
    ]
    values.push(str)
  }

  await gsp.set_sheet_data(ss_id, data_range, values)
}