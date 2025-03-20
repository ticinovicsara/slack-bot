require("dotenv").config();
const { App } = require("@slack/bolt");
const { getItems, refreshCache } = require("./src/sheets_api");
const { getLikelyItems } = require("./src/matcher");
const { getMessageForOptions } = require("./src/composer");

const { SLACK_BOT_TOKEN, SLACK_SIGNING_SECRET, SLACK_APP_TOKEN } = process.env;
const PORT = process.env.PORT || 8080;

const slackApp = new App({
  token: SLACK_BOT_TOKEN,
  signingSecret: SLACK_SIGNING_SECRET,
  socketMode: true,
  appToken: SLACK_APP_TOKEN,
  port: PORT || 3000,
});

app.event("app_mention", async ({ event, say }) => {
  const userText = event.text.trim().toLowerCase();

  if (userText == "refresh") {
    refreshCache();
    return;
  }

  const items = getItems();
  const likelyItems = getLikelyItems(items, userText);
  const responseText = getMessageForOptions(likelyItems, userText);

  await say(responseText);
});

(async () => {
  cachedItems = await getItems();

  await app.start(PORT || 3000);

  app.logger.info("App is running!");
})();
