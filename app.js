import { getItems, refreshCache } from "./src/sheets_api.js";
import { getLikelyItems, getSearchedWord } from "./src/matcher.js";
import { getMessageForOptions } from "./src/comsposer.js";
import pkg from "@slack/bolt";

const { App } = pkg;

const { SLACK_BOT_TOKEN, SLACK_SIGNING_SECRET, SLACK_APP_TOKEN } = process.env;
const PORT = process.env.PORT || 8080;

const app = new App({
  token: SLACK_BOT_TOKEN,
  signingSecret: SLACK_SIGNING_SECRET,
  socketMode: true,
  appToken: SLACK_APP_TOKEN,
  port: PORT || 3000,
});

app.event("app_mention", async ({ event, say }) => {
  const query = event.text
    .replace(/<@[A-Z0-9]+>/gi, "")
    .trim()
    .toLowerCase();

  let words = query.split(/\s+/).filter((word) => word.trim() !== "");

  if (words.includes("refresh")) {
    refreshCache();
    return;
  }

  const items = getItems();
  const likelyItems = getLikelyItems(items, words);
  let searchedWord = getSearchedWord();
  const responseText = getMessageForOptions(likelyItems, searchedWord);

  await say(responseText);
});

(async () => {
  await app.start(PORT || 3000);

  app.logger.info("App is running!");
})();
