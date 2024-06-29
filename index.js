const { Client, GatewayIntentBits } = require('discord.js');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

const CHECK_INTERVAL = 24 * 60 * 60 * 1000;

const BOT_TOKEN = process.env.BOT_TOKEN || '';
const GUILD_ID = process.env.GUILD_ID || '';
const CHANNEL_ID = process.env.CHANNEL_ID || '';

const GAMES_FILE_PATH = path.join(__dirname, 'games.json');
const SETTING_FILE_PATH = path.join(__dirname, 'setting.json');

function loadGames() {
  try {
    const data = fs.readFileSync(GAMES_FILE_PATH);
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading games file:', error);
    return [];
  }
}

function saveGames(games) {
  try {
    fs.writeFileSync(GAMES_FILE_PATH, JSON.stringify(games, null, 2));
  } catch (error) {
    console.error('Error writing games file:', error);
  }
}

function setMessageId(type, messageId) {
  try {
    const data = fs.readFileSync(SETTING_FILE_PATH);
    const list = JSON.parse(data);
    const messageType = list.find(item => item.name === type);
    messageType.messageId = messageId;
    fs.writeFileSync(SETTING_FILE_PATH, JSON.stringify(list, null, 2));
    updateOriginalMessage(type, messageId);
    return true;
  } catch (error) {
    console.error('Error writing message id file:', error);
    return false;
  }
}

function checkMessageId(type) {
  try {
    const data = fs.readFileSync(SETTING_FILE_PATH);
    const list = JSON.parse(data);
    const messageType = list.find(item => item.name === type);
    return messageType.messageId ? messageType.messageId : false;
  } catch (error) {
    console.error('Error reading message id file:', error);
    return false;
  }
}

async function checkForDiscounts() {
  console.log('Checking for discounts...');
  const data = loadGames();
  const decidedList = data.find(list => list.name === "decided");
  const consideringList = data.find(list => list.name === "considering");
  const boughtList = data.find(list => list.name === "bought");

  await Promise.all(boughtList.list.map(async (item) => {
    try {
      const response = await axios.get(`https://store.steampowered.com/api/appdetails?appids=${item.id}&cc=my`);
      const gameData = response.data[item.id].data;
      if (gameData) {
        const discountPercent = gameData.price_overview?.discount_percent || 0;
        const name = gameData.name;
        const coming_soon = gameData.release_date?.coming_soon || false;
        const early_access = gameData.genres?.filter(genre => genre.id === "70").length > 0 || false;
        const url = `https://store.steampowered.com/app/${item.id}/`;
        const currentPrice = (gameData.price_overview?.final || 0) / 100;
        const currency = gameData.price_overview?.currency || 'undefined';
        item.name = gameData.name;
        item.discountPercent = discountPercent;
        item.url = url;
        item.coming_soon = coming_soon;
        item.early_access = early_access;
        item.currentPrice = currentPrice;
        item.currency = currency;
      }
    } catch (error) {
      console.error(`Error checking for discount on game ID ${item.id}:`, error);
    }
  }));

  await Promise.all(decidedList.list.map(async (item) => {
    try {
      const response = await axios.get(`https://store.steampowered.com/api/appdetails?appids=${item.id}&cc=my`);
      const gameData = response.data[item.id].data;
      if (gameData) {
        const discountPercent = gameData.price_overview?.discount_percent || 0;
        const name = gameData.name;
        const coming_soon = gameData.release_date?.coming_soon || false;
        const early_access = gameData.genres?.filter(genre => genre.id === "70").length > 0 || false;
        const url = `https://store.steampowered.com/app/${item.id}/`;
        const currentPrice = (gameData.price_overview?.final || 0) / 100;
        const currency = gameData.price_overview?.currency || 'undefined';
        item.name = gameData.name;
        item.url = url;
        item.coming_soon = coming_soon;
        item.early_access = early_access;
        item.currentPrice = currentPrice;
        item.currency = currency;

        if (discountPercent > 0 && item.discountPercent !== discountPercent) {
          console.log('Discount found on game:', item.id, item.name, discountPercent);
          item.discountPercent = discountPercent;
          const discountMessage = `The game ${name} is now on sale with a ${discountPercent}% discount! Current price: ${currentPrice} ${currency}.`;
          const guild = client.guilds.cache.get(GUILD_ID);
          if (guild) {
            const channel = guild.channels.cache.get(CHANNEL_ID);
            if (channel) {
              channel.send(discountMessage);
            }
          }
        } else  {
          item.discountPercent = discountPercent;
        }
      }
    } catch (error) {
      console.error(`Error checking for discount on game ID ${item.id}:`, error);
    }
  }));

  await Promise.all(consideringList.list.map(async (item) => {
    try {
      const response = await axios.get(`https://store.steampowered.com/api/appdetails?appids=${item.id}&cc=my`);
      const gameData = response.data[item.id].data;
      if (gameData) {
        const discountPercent = gameData.price_overview?.discount_percent || 0;
        const name = gameData.name;
        const coming_soon = gameData.release_date?.coming_soon || false;
        const early_access = gameData.genres?.filter(genre => genre.id === "70").length > 0 || false;
        const url = `https://store.steampowered.com/app/${item.id}/`;
        const currentPrice = (gameData.price_overview?.final || 0) / 100;
        const currency = gameData.price_overview?.currency || 'undefined';
        item.name = gameData.name;
        item.url = url;
        item.coming_soon = coming_soon;
        item.early_access = early_access;
        item.currentPrice = currentPrice;
        item.currency = currency;

        if (discountPercent > 0 && item.discountPercent !== discountPercent) {
          console.log('Discount found on game:', item.id, item.name, discountPercent);
          item.discountPercent = discountPercent;
          const discountMessage = `The game ${name} is now on sale with a ${discountPercent}% discount! Current price: ${currentPrice} ${currency}.`;
          const guild = client.guilds.cache.get(GUILD_ID);
          if (guild) {
            const channel = guild.channels.cache.get(CHANNEL_ID);
            if (channel) {
              channel.send(discountMessage);
            }
          }
        } else  {
          item.discountPercent = discountPercent;
        }
      }
    } catch (error) {
      console.error(`Error checking for discount on game ID ${item.id}:`, error);
    }
  }));

  saveGames(data);
  const boughtMessageId = checkMessageId('bought');
  if (boughtMessageId) {
    updateOriginalMessage('bought', boughtMessageId);
  }
  const decidedMessageId = checkMessageId('decided');
  if (decidedMessageId) {
    updateOriginalMessage('decided', decidedMessageId);
  }
  const consideringMessageId = checkMessageId('considering');
  if (consideringMessageId) {
    updateOriginalMessage('considering', consideringMessageId);
  }
  const discountMessageId = checkMessageId('discount');
  if (discountMessageId) {
    updateOriginalMessage('discount', discountMessageId);
  }
}

setInterval(checkForDiscounts, CHECK_INTERVAL);

async function addGame(type, gameId, description) {
  if (isNaN(gameId)) {
    gameId = gameId.split('/')[4];
  }
  const data = loadGames();
  const decidedList = data.find(list => list.name === "decided");
  const consideringList = data.find(list => list.name === "considering");
  const boughtList = data.find(list => list.name === "bought");
  const allGames = data.reduce((accumulator, currentItem) => {
    return accumulator.concat(currentItem.list);
  }, []);
  if (!allGames.find(game => game.id === gameId)) {
    try {
      const response = await axios.get(`https://store.steampowered.com/api/appdetails?appids=${gameId}&cc=my`);
      const gameData = response.data[gameId].data;
      if (gameData) {
        const discountPercent = gameData.price_overview?.discount_percent || 0;
        const name = gameData.name;
        const coming_soon = gameData.release_date?.coming_soon || false;
        const early_access = gameData.genres?.filter(genre => genre.id === "70").length > 0 || false;
        const url = `https://store.steampowered.com/app/${gameId}/`;
        const currentPrice = (gameData.price_overview?.final || 0) / 100;
        const currency = gameData.price_overview?.currency || 'undefined';
        if (type === "decided") {
          decidedList.list.push({ id: gameId, name, discountPercent, url, coming_soon, early_access, description, currentPrice, currency });
        } else if (type === "considering") {
          consideringList.list.push({ id: gameId, name, discountPercent, url, coming_soon, early_access, description, currentPrice, currency });
        } else if (type === "bought") {
          boughtList.list.push({ id: gameId, name, discountPercent, url, coming_soon, early_access, description, currentPrice, currency });
        }

        saveGames(data);

        if (discountPercent > 0) {
          const discountMessage = `The game ${name} is now on sale with a ${discountPercent}% discount! Current price: ${currentPrice} ${currency}.`;
          const guild = client.guilds.cache.get(GUILD_ID);
          if (guild) {
            const channel = guild.channels.cache.get(CHANNEL_ID);
            if (channel) {
              channel.send(discountMessage);
            }
          }
          const discountMessageId = checkMessageId('discount');
          if (discountMessageId) {
            updateOriginalMessage('discount', discountMessageId);
          }
        }

        const messageId = checkMessageId(type);
        if (messageId) {
          updateOriginalMessage(type, messageId);
        }

        return JSON.stringify({ status: 'success', messageText: 'Game added' });
      } else {
        return JSON.stringify({ status: 'error', messageText: 'Invalid game url or game id' });
      }

    } catch (error) {
      console.error(`Error adding game with ID ${gameId}:`, error);
      return JSON.stringify({ status: 'error', messageText: 'Unable to call Steam API.' });
    }
  } else {
    let messageText = 'Game already in the list';
    let gameIndex = boughtList.list.findIndex(game => game.id === gameId);
    if (gameIndex !== -1 && type !== "bought") {
      const [game] = boughtList.list.splice(gameIndex, 1);
      if (description != '') {
        game.description = description;
      }
      if (type === "decided") {
        decidedList.list.push(game);
        messageText = 'Game transferred from bought to decided';
      } else if (type === "considering") {
        consideringList.list.push(game);
        messageText = 'Game transferred from bought to considering';
      }
    } else if (gameIndex !== -1 && type === "bought") {
      if (description != '') {
        boughtList.list[gameIndex].description = description;
      }
    }

    gameIndex = consideringList.list.findIndex(game => game.id === gameId);
    if (gameIndex !== -1 && type !== "considering") {
      const [game] = consideringList.list.splice(gameIndex, 1);
      if (description != '') {
        game.description = description;
      }
      if (type === "decided") {
        decidedList.list.push(game);
        messageText = 'Game transferred from considering to decided';
      } else if (type === "bought") {
        boughtList.list.push(game);
        messageText = 'Game transferred from considering to bought';
      }
    } else if (gameIndex !== -1 && type === "considering") {
      if (description != '') {
        consideringList.list[gameIndex].description = description;
      }
    }

    gameIndex = decidedList.list.findIndex(game => game.id === gameId);
    if (gameIndex !== -1 && type !== "decided") {
      const [game] = decidedList.list.splice(gameIndex, 1);
      if (description != '') {
        game.description = description;
      }
      if (type === "considering") {
        consideringList.list.push(game);
        messageText = 'Game transferred from decided to considering';
      } else if (type === "bought") {
        boughtList.list.push(game);
        messageText = 'Game transferred from decided to bought';
      }
    } else if (gameIndex !== -1 && type === "decided") {
      if (description != '') {
        decidedList.list[gameIndex].description = description;
      }
    }

    saveGames(data);
    const boughtMessageId = checkMessageId('bought');
    if (boughtMessageId) {
      updateOriginalMessage('bought', boughtMessageId);
    }
    const decidedMessageId = checkMessageId('decided');
    if (decidedMessageId) {
      updateOriginalMessage('decided', decidedMessageId);
    }
    const consideringMessageId = checkMessageId('considering');
    if (consideringMessageId) {
      updateOriginalMessage('considering', consideringMessageId);
    }
    return JSON.stringify({ status: 'success', messageText });
  }
}

async function removeGame(gameId) {
  if (isNaN(gameId)) {
    gameId = gameId.split('/')[4];
  }
  const data = loadGames();
  const decidedList = data.find(list => list.name === "decided");
  const consideringList = data.find(list => list.name === "considering");
  const boughtList = data.find(list => list.name === "bought");
  let gameIndex = boughtList.list.findIndex(game => game.id === gameId);
  if (gameIndex !== -1) {
    boughtList.list.splice(gameIndex, 1);
    saveGames(data);
    const messageId = checkMessageId('bought');
    if (messageId) {
      updateOriginalMessage('bought', messageId);
    }
    return JSON.stringify({ status: 'success', messageText: 'Game removed from bought list' });
  }

  gameIndex = consideringList.list.findIndex(game => game.id === gameId);
  if (gameIndex !== -1) {
    consideringList.list.splice(gameIndex, 1);
    saveGames(data);
    const messageId = checkMessageId('considering');
    if (messageId) {
      updateOriginalMessage('considering', messageId);
    }
    return JSON.stringify({ status: 'success', messageText: 'Game removed from considering list' });
  }

  gameIndex = decidedList.list.findIndex(game => game.id === gameId);
  if (gameIndex !== -1) {
    decidedList.list.splice(gameIndex, 1);
    saveGames(data);
    const messageId = checkMessageId('decided');
    if (messageId) {
      updateOriginalMessage('decided', messageId);
    }
    return JSON.stringify({ status: 'success', messageText: 'Game removed from decided list' });
  }
  return JSON.stringify({ status: 'error', messageText: 'Game not found in the list.' });
}

async function updateOriginalMessage(type, messageId) {
  const data = loadGames();

  let dataList = [];
  if (type !== 'discount') {
    dataList = data.find(list => list.name === type).list;
  } else {
    dataList = data.filter(list => list.name === 'decided' || list.name === 'considering')
      .flatMap(list => list.list);
  }
  let header = '';

  if (type === 'bought') {
    header = '\*\*==BOUGHT==\*\*\n';
  } else if (type === 'decided') {
    header = '\*\*==DECIDED==\*\*\n';
  } else if (type === 'considering') {
    header = '\*\*==CONSIDERING==\*\*\n';
  } else if (type === 'discount') {
    header = '\*\*==DISCOUNT NOW==\*\*\n';
  }

  dataList.sort((a, b) => {
    if (a.coming_soon && !b.coming_soon) return 1;
    if (!a.coming_soon && b.coming_soon) return -1;
    if (a.early_access && !b.early_access) return 1;
    if (!a.early_access && b.early_access) return -1;
    return 0;
  });

  dataList.forEach(item => {
    if (type !== 'discount') {
      header += `${item.name} ${item.description ? item.description : ''}${item.coming_soon ? ` \`Coming Soon\`` : ''}${item.early_access ? ` \`Early Access\`` : ''}\n${item.url}\n`;
    } else {
      if (item.discountPercent > 0) {
        header += `${item.name} \`${item.discountPercent}% OFF\` \`${item.currentPrice} ${item.currency}\` \n${item.url}\n`;
      }
    }
  });

  const guild = client.guilds.cache.get(GUILD_ID);
  if (guild) {
    const channel = guild.channels.cache.get(CHANNEL_ID);
    if (channel) {
      const message = await channel.messages.fetch(messageId);
      if (message) {
        if (`${header}`.length < 2000) {
          message.edit(`${header}`);
        } else {
          channel.send('List is too long to be displayed in a single message. Please consider removing some games or splitting the list into multiple messages.');
        }
      }
    }
  }
}

client.login(BOT_TOKEN);

client.once('ready', () => {
  console.log('Ready to check for discounts!');
  checkForDiscounts();
});

client.on('messageCreate', async message => {
  const sendHelpMessage = () => {
    const helpText = `Available commands:\n\n` +
      `\*\*!addBought\*\* \*\*\*<game_id> <message (optional)>\*\*\* - Add a game to the bought list. Message is optional.\n` +
      `\*\*!addDecided\*\* \*\*\*<game_id> <message (optional)>\*\*\* - Add a game to the decided list. Message is optional.\n` +
      `\*\*!addConsidering\*\* \*\*\*<game_id> <message (optional)>\*\*\* - Add a game to the considering list. Message is optional.\n` +
      `\*\*!removeGame\*\* \*\*\*<game_id>\*\*\* - Remove a game from the list.\n` +
      `\*\*!listGames\*\* - Display instructions to set up the message to hold the game list.\n` +
      `\*\*!setMessageId\*\* \*\*\*<type> <message_id>\*\*\* - Set the message to hold the latest information for the list of a specified type. (type: bought, decided, considering, discount)\n` +
      `\*\*!checkDiscounts\*\* - Trigger a check for discounts on the games in the list.`;
    message.channel.send(helpText);
  };

  const handleAddGame = async (type) => {
    const [command, gameId, ...descriptionParts] = message.content.split(' ');
    const description = descriptionParts.join(' ');
    const { status, messageText } = JSON.parse(await addGame(type, gameId, description));

    if (status === 'success') {
      const messageId = checkMessageId(type);
      const successMessage = messageId
        ? `${messageText}. Check pinned message for the list of games being watched.`
        : `Game added to the watch list. Please set the message id using !setMessageId ${type} <message_id> command to get updates in a pinned message.`;
      message.channel.send(successMessage);
    } else {
      message.channel.send(`${messageText}.`);
    }
  };

  const handleRemoveGame = async () => {
    const [command, gameId] = message.content.split(' ');
    const { status, messageText } = JSON.parse(await removeGame(gameId));

    if (status === 'success') {
      const successMessage = `Game removed from the watch list.`;
      message.channel.send(successMessage);
    } else {
      message.channel.send(`${messageText}.`);
    }
  };

  const handleListGames = () => {
    const listMessage = 'You can use this message as the base for the list of games being watched. Please use the !setMessageId <type> <message_id> command to set this message as the one to be updated with the latest information.';
    message.channel.send(listMessage);
  };

  const handleSetMessageId = () => {
    const [command, type, messageId] = message.content.split(' ');
    const updateSuccess = setMessageId(type, messageId);

    if (updateSuccess) {
      message.channel.send(`Message ID updated to ${messageId}. Future updates will be posted in this message.`);
    } else {
      message.channel.send('Error updating message ID. Please try again.');
    }
  };

  const handleCheckDiscounts = () => {
    checkForDiscounts();
    const messageId = checkMessageId('discount');
    if (messageId) {
      message.channel.send(`Discounts checked. Check pinned message for the list of games with discounts.`);
    } else {
      message.channel.send(`Discounts checked. No message set to display the list of games with discounts. Please use the !setMessageId discount <message_id> command to set a message.`);
    }
  };

  if (message.content === '!help') {
    sendHelpMessage();
  } else if (message.content.startsWith('!addBought ')) {
    handleAddGame('bought');
  } else if (message.content.startsWith('!addDecided ')) {
    handleAddGame('decided');
  } else if (message.content.startsWith('!addConsidering ')) {
    handleAddGame('considering');
  } else if (message.content.startsWith('!removeGame ')) {
    handleRemoveGame();
  } else if (message.content === '!listGames') {
    handleListGames();
  } else if (message.content.startsWith('!setMessageId')) {
    handleSetMessageId();
  } else if (message.content === '!checkDiscounts') {
    handleCheckDiscounts();
  }
});
