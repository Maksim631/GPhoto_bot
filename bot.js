const TelegramBot = require('node-telegram-bot-api');


// Create a bot that uses 'polling' to fetch new updates
const config = require('./config.js');
const { google } = require('googleapis');
const fs = require('fs');
const { getFileBytes, uploadBytes, createMedia } = require('./photo');

const oauth2Client = new google.auth.OAuth2(
    config.oAuthClientID,
    config.oAuthclientSecret,
    config.oAuthCallbackUrl
)

const bot = new TelegramBot(config.tgToken, { polling: true });
let token;

// Matches "/echo [whatever]"
bot.onText(/\/echo (.+)/, (msg, match) => {
    // 'msg' is the received Message from Telegram
    // 'match' is the result of executing the regexp above on the text content
    // of the message

    const chatId = msg.chat.id;
    const resp = match[1]; // the captured "whatever"

    // send back the matched "whatever" to the chat
    bot.sendMessage(chatId, resp);
});

bot.onText(/\/login/, (msg, match) => {
    const chatId = msg.chat.id;
    const url = oauth2Client.generateAuthUrl({
        scope: config.scopes
    });
    bot.sendMessage(chatId, url);

})

bot.onText(/\/secret (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const secret = match[1];
    token = (await oauth2Client.getToken(secret)).tokens.access_token;
    bot.sendMessage(chatId, 'Token successfully added');
})

bot.on('photo', async (msg) => {
    const chatId = msg.chat.id;
    const fileId = msg.photo[msg.photo.length - 1].file_id;
    const { data: photoBytes } = await getFileBytes(fileId, config.tgToken);
    const { data: inputBytes } = await uploadBytes(photoBytes, token);
    const result = await createMedia(inputBytes, token);
    console.log(result);
    bot.sendMessage(chatId, 'Photo added');
})

module.exports = bot;