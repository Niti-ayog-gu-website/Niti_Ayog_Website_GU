// config/googleSheets.js
// Returns a sheets client if credentials are available, otherwise a stub
// that lets the server boot without Google credentials in local dev.

let sheets;

try {
  const { google } = require('googleapis');

  let credentials;
  if (process.env.GOOGLE_SERVICE_ACCOUNT) {
    credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT);
  } else {
    // Try local file — if missing, fall through to stub
    credentials = require('./serviceAccount.json');
  }

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  });

  sheets = google.sheets({ version: 'v4', auth });
} catch {
  // No credentials available — return a stub so the server still boots.
  // Sync calls will fail gracefully.
  sheets = {
    spreadsheets: {
      values: {
        get: async () => { throw new Error('Google Sheets credentials not configured'); },
      },
    },
  };
}

module.exports = sheets;
