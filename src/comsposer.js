export function getMessageForOptions(items, searched_item) {
  if (!items || items.length === 0) {
    return `Nažalost, ne mogu pronaći  _${searched_item}_`;
  }

  let message = `Evo izglednih kandidata za '${searched_item}': `;

  for (const item of items) {
    message += `\n- *${item.item.name}*:\t${item.item.location}`;
  }

  return message;
}
