// const { google } = require('googleapis');
// const path       = require('path');

// const auth = new google.auth.GoogleAuth({
//   keyFile: path.join(__dirname, 'serviceAccount.json'),
//   scopes:  ['https://www.googleapis.com/auth/spreadsheets.readonly'],
// });

// const sheets = google.sheets({ version: 'v4', auth });

// module.exports = sheets;

const { google } = require('googleapis');

// Use env variable on production, fall back to local file in development
let credentials;

if (process.env.GOOGLE_SERVICE_ACCOUNT) {
  // Production — credentials stored as environment variable
  credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT);
} else {
  // Local development — read from file
  credentials = require('./serviceAccount.json');
}

const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
});

const sheets = google.sheets({ version: 'v4', auth });

module.exports = sheets;