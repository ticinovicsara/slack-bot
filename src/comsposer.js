export function getMassageForOptions(items, searched_item) {
  if (!items) return `Nažalost, ne mogu pronaći _${searched_item}_`;

  let message = `Evo izglednih kandidata za _${searched_item}_: `;

  for (const item of items) {
    message += `\n- *${item.item.name}*:\t${item.item.location}`;
  }

  return message;
}
