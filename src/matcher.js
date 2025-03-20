import cachedItems from "./sheets_api";

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
