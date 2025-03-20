import levenshtein from "fast-levenshtein";
import { MIN_SCORE, MAX_ITEMS } from "./config.js";

function normalizeText(text) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

let searchedWord = "";

function getScoredItem(item, pattern) {
  const normalizedItemName = normalizeText(item.name);
  const normalizedPattern = normalizeText(pattern);

  const distance = levenshtein.get(normalizedPattern, normalizedItemName);
  const maxLength = Math.max(
    normalizedPattern.length,
    normalizedItemName.length
  );

  const score = (1 - distance / maxLength) * 100;

  return {
    item,
    score,
    key: item.name,
  };
}

export function getLikelyItems(items, words) {
  const likelyItems = [];

  words.forEach((word) => {
    items.forEach((item) => {
      const scoredItem = getScoredItem(item, word);

      if (scoredItem.score > MIN_SCORE) {
        likelyItems.push(scoredItem);
        searchedWord = scoredItem.key;
      }
    });
  });

  const sortedItems = likelyItems
    .sort((a, b) => b.score - a.score)
    .slice(0, MAX_ITEMS);
  return sortedItems;
}

export function getSearchedWord() {
  return searchedWord;
}
