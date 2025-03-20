class Message {
  constructor(sender, text) {
    this.sender = sender;
    this.text = text;
  }

  static fromJson(data) {
    const message = data?.results?.[0];
    if (!message) throw new Error("Podaci nisu valjani za Message");

    return new Message(message.from, message.message.text);
  }
}

class Item {
  constructor(name, location) {
    this.name = name;
    this.location = location;
  }

  static fromJson(data) {
    if (!data.name || !data.location)
      throw new Error("Podaci nisu valjani za Item");

    return new Item(data.name, data.location);
  }
}
