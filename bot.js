require("dotenv").config();
const { App } = require("@slack/bolt");
const { google } = require("googleapis");
const fuzzy = require("fuzzy");

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
});

const auth = new google.auth.GoogleAuth({
  keyFile: process.env.GOOGLE_CREDENTIALS,
  scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
});
const sheets = google.sheets({ version: "v4", auth });

let cachedItems = [];

async function getItems() {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: "A:B",
    });

    const rows = response.data.values;
    if (!rows) return [];

    return rows.slice(1).map((row) => ({
      name: row[0],
      location: row[1],
    }));
  } catch (error) {
    console.error("Greška u dohvaćanju Sheets podataka:", error);
    return [];
  }
}

// Pretraga sličnih unosa
function getLikelyItems(query) {
  const names = cachedItems.map((item) => item.name);
  const results = fuzzy.filter(query, names);
  return results
    .map((match) => ({
      item: cachedItems.find((item) => item.name === match.original),
      score: match.score,
    }))
    .filter((result) => result.score > 50)
    .slice(0, 10);
}

// Obrada poruka
app.message(async ({ message, say }) => {
  console.log("Primljena poruka:", message);
  const userText = message.text.trim().toLowerCase();

  if (userText === "refresh") {
    cachedItems = await getItems();
    await say("🔄 Podaci su osvježeni!");
    return;
  }

  const matches = getLikelyItems(userText);
  if (matches.length === 0) {
    await say(`❌ Nema rezultata za _${userText}_`);
    return;
  }

  let response = `🔍 Pronađeni rezultati za _${userText}_:\n`;
  matches.forEach((item) => {
    response += `- *${item.item.name}*: ${item.item.location}\n`;
  });

  await say(response);
});

// Pokretanje bota
(async () => {
  cachedItems = await getItems();
  await app.start(8080);
  console.log("⚡ Slack bot je pokrenut!");
})();
