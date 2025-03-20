require("dotenv").config();
const { App } = require("@slack/bolt");
const { google } = require("googleapis");
const fuzzy = require("fuzzy");

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN,
  port: process.env.PORT || 3000,
});

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

  await app.start(process.env.PORT || 3000);

  app.logger.info("⚡️ Bolt app is running!");
})();
