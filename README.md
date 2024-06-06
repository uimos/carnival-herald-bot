# Carnival Herald Bot
A discord bot will save your Steam game in to list and check for discount daily.

There are 3 types of list
- Bought
    - This list mainly for game that already bought and wait to be play. You will not get notify if the game is in this list.
- Decided
    - This list is for games that already confirm will play in future, but will want to buy when got discount.
- Considering
    - This list is for games that might play in the future, will want to check for discount.

> All list game will also tag with `Early Access` or `Coming Soon` if available.

## Available commands:

`!help` - List all available commands.
`!addBought <game_id> <message (optional)>` - Add a game to the bought list. Message is optional.
`!addDecided <game_id> <message (optional)>` - Add a game to the decided list. Message is optional.
`!addConsidering <game_id> <message (optional)>` - Add a game to the considering list. Message is optional.
`!removeGame <game_id>` - Remove a game from the list.
`!listGames` - Display instructions to set up the message to hold the game list.
`!setMessageId <type> <message_id>` - Set the message to hold the latest information for the list of a specified type. (type: bought, decided, considering, discount)
`!checkDiscounts` - Trigger a check for discounts on the games in the list.

## Installation
Create .env file to store your config.
```
BOT_TOKEN = '';
GUILD_ID = '';
CHANNEL_ID = '';
```

Install all the packages
```
npm install
```

To run the code
```
node index.js
```