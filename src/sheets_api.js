const { google } = require("googleapis");

const auth = new google.auth.GoogleAuth({
  keyFile: process.env.GOOGLE_CREDENTIALS,
  scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
});
const sheets = google.sheets({ version: "v4", auth });

let cachedItems = [];

async function refreshCache() {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: "A:B",
    });

    const rows = response.data.values;
    if (!rows) {
      console.log("Nema podataka u tablici.");
      return;
    }

    cachedItems = rows.slice(1).map((row) => ({
      name: row[0],
      location: row[1] || "Nepoznata lokacija",
    }));

    console.log(
      `✅ Podaci su osvježeni! ${cachedItems.length} stavki učitano.`
    );
  } catch (error) {
    console.error("Greska u dohvacanju Sheets podataka:", error);
    return [];
  }
}

function getItems() {
  return cachedItems;
}

module.exports = { getItems, refreshCache };
