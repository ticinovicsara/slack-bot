# slack-bot

## Requirements

- Node.js (>= 14.x.x)
- Slack workspace where the bot will be installed
- Google Sheets API credentials for reading item data from Google Sheets

## Setup and Installation

After cloning, install dependencies:
```bash
npm install

Then, set up environment variables in .env file:
Create a .env file in the root directory and provide the following values:

```bash
SLACK_BOT_TOKEN=your-slack-bot-token
SLACK_SIGNING_SECRET=your-slack-signing-secret
SLACK_APP_TOKEN=your-slack-app-token
GOOGLE_SHEET_ID=your-google-sheet-id
GOOGLE_CREDENTIALS=your-google-credentials-json-file-path


You can get the Slack tokens by following the [Slack API documentation](https://api.slack.com/).

For Google Sheets API setup, refer to the [Google Sheets API documentation](https://developers.google.com/sheets/api/quickstart/js).
