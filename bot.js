require("dotenv").config();
const { App } = require("@slack/bolt");
const { google } = require("googleapis");
const fuzzy = require("fuzzy");
const express = require("express");

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  logLevel: "debug",
});

const appServer = express();
appServer.use(express.json());

appServer.post("/", async (req, res) => {
  console.log("Primljen POST zahtjev:", req.body);
  if (req.body.challenge) {
    console.log("Primljen challenge request:", req.body.challenge);
    return res.status(200).send(req.body.challenge);
  }

  res.status(404).send("Not found");
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

app.event("app_mention", async ({ event, say }) => {
  console.log("Spomenuta poruka je primljena:", event);

  const userText = event.text.trim().toLowerCase();
  if (userText.includes("kalkulator")) {
    console.log("Reagira na kalkulator");
    await say("🔢 Kalkulator je u ladici ispod stola!");
  } else if (userText.includes("kaiš")) {
    console.log("Reagira na kaiš");
    await say("👗 Kaiš je u ormaru!");
  } else {
    console.log("Ne prepoznajem tekst");
    await say(
      "Izgleda da nisam razumio što tražiš. Pokušaj s nekim od podataka."
    );
  }
});

(async () => {
  cachedItems = await getItems();
  console.log("Bot podaci učitani:", cachedItems);

  appServer.listen(3000, () => {
    console.log("⚡ Web server pokrenut na portu 3000");
  });

  await app.start(8080);
  console.log("⚡ Slack bot je pokrenut na 8080!");
})();
