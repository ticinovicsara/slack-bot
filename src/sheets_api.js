const { google } = require("googleapis");

const auth = new google.auth.GoogleAuth({
  keyFile: process.env.GOOGLE_CREDENTIALS,
  scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
});
const sheets = google.sheets({ version: "v4", auth });

export let cachedItems = new Map();

async function getItems() {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: "A:B",
    });

    const rows = response.data.values;
    if (!rows) return [];

    rows.slice(1).forEach((row) => {
      const itemName = row[0];
      const itemLocation = row[1];

      if (cachedItems.has(itemName)) {
        let existingItem = cachedItems.get(itemName);
        if (existingItem.location !== itemLocation) {
          console.log(`Azuriram stavku: ${itemName}`);
          cachedItems.set(itemName, { name: itemName, location: itemLocation });
        }
      } else {
        console.log(`Dodajem novu stavku: ${itemName}`);
        cachedItems.set(itemName, { name: itemName, location: itemLocation });
      }
    });
  } catch (error) {
    console.error("Greska u dohvacanju Sheets podataka:", error);
    return [];
  }
}

export function getItems() {
  return Array.from(cachedItems.values());
}
