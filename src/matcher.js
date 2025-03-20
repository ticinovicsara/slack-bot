import cachedItems from "./sheets_api";
import fuzzy from "fuzzy";
import { MIN_SCORE, MAX_ITEMS } from "./config.js";

function getScoredItem(item, pattern) {
  const score = fuzzy.filter(pattern, [item.name])[0]?.score || 0;
  return { item, score };
}

export function getLikelyItems(query) {
  const likelyItems = cachedItems
    .map((item) => getScoredItem(item, query))
    .filter((scoredItem) => scoredItem.score > MIN_SCORE)
    .sort((a, b) => b.score - a.score)
    .slice(0, MAX_ITEMS);

  return likelyItems;
}
