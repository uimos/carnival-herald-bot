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

`!cleanupMessages` - Manually trigger cleanup of old temporary messages.

`!messageStats` - Show statistics about temporary messages.

`!backupGames` - Create a manual backup of `games.json`.

## New Features

### Server Status Logging
The bot now writes only the latest discount check timestamp to `server_status.json`:
- `lastDiscountCheckRunAt`
- `lastDiscountCheckRunLocal`
- `timezone`

Each check overwrites the old value, so the file always shows the latest run time.

### Automatic Message Cleanup
The bot now automatically stores and deletes temporary messages after 14 days to keep your Discord channel clean. This includes:
- Discount notifications
- Command confirmation messages
- Error messages
- Status updates

### Configuration
You can adjust the message retention period by modifying the `MESSAGE_RETENTION_DAYS` constant in `index.js`:
- Default: 14 days
- For 7 days: Change to `7`
- For 1 day: Change to `1`

### Files Created
- `temp_messages.json` - Stores temporary message IDs and deletion timestamps
- `server_status.json` - Stores the latest discount check run time
- `backups/games.backup.json` - Single backup file for `games.json` (overwritten each time)

### Games Backup
- A backup is created on startup
- A backup is created before every write to `games.json`
- You can trigger a manual backup with `!backupGames`
- Only one backup file is kept and overwritten: `backups/games.backup.json`

### Cleanup Schedule
- Automatic cleanup check runs every hour
- Manual cleanup can be triggered with `!cleanupMessages`
- Cleanup runs on bot startup to handle any messages that should have been deleted while the bot was offline

### Discount Check Schedule
- Automatic discount check runs every 24 hours
- Manual check can be triggered with `!checkDiscounts`

## Installation
Create .env file to store your config.
```
BOT_TOKEN=abc
GUILD_ID=123
CHANNEL_ID=123
```

Install all the packages
```
npm install
```

To run the code
```
node index.js
```
