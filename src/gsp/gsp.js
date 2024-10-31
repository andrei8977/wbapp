// google spreadsheet functions
require('dotenv').config();

const {google} = require("googleapis")

const API_KEY_PATH = process.env.API_KEY_PATH

const apikeys = require("." + API_KEY_PATH);
const SCOPE = ['https://www.googleapis.com/auth/spreadsheets']
const client = new google.auth.JWT(apikeys.client_email, "null", apikeys.private_key, SCOPE)
const gsapi = google.sheets({version: "v4", auth: client})

module.exports = {

  /**
   * Clear Google SpreadSheet data
   * @param {string} ss_id Google SpreadsheetID
   * @param {string} data_range Google Sheet DataRange in format "A1:B1"
   */
  async clear_sheet_data(ss_id, data_range){
    const opt = {
      spreadsheetId: ss_id,
      range: data_range
    }
    let response = await gsapi.spreadsheets.values.clear(opt).catch(error => {
      console.log("Error: ", error.errors)
      return false;
    });

  },

  /**
   * Updating Google SpreadSheet
   * @param {string} ss_id Google SpreadsheetID
   * @param {string} data_range Google Sheet DataRange in format "A1:B1"
   * @param {*} values 
   * @returns 
   */
  async set_sheet_data(ss_id, data_range, values){
    const opt = {
      spreadsheetId: ss_id,
      range: data_range,
      valueInputOption: 'RAW',
      resource: {
        values: values
      }
    }
    let response = await gsapi.spreadsheets.values.update(opt).catch(error => {
      console.log("Error: ", error.errors)
      return false;
    });
    
  }

}