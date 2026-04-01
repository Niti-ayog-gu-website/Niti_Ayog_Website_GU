const { google } = require('googleapis');
const path       = require('path');

const auth = new google.auth.GoogleAuth({
  keyFile: path.join(__dirname, 'serviceAccount.json'),
  scopes:  ['https://www.googleapis.com/auth/spreadsheets.readonly'],
});

const sheets = google.sheets({ version: 'v4', auth });

module.exports = sheets;