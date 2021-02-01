const TelegramBot = require('node-telegram-bot-api');
const User = require('./db/user.schema');

const config = require('./config.js');
const { google } = require('googleapis');
const { getFileBytes, uploadBytes, createMedia } = require('./photo');

const oauth2Client = new google.auth.OAuth2(
    config.oAuthClientID,
    config.oAuthclientSecret,
    config.oAuthCallbackUrl
)
// я добавил
const bot = new TelegramBot(config.tgToken, { polling: true });

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
    const token = (await oauth2Client.getToken(secret)).tokens.access_token;
    await User.findOneAndUpdate({ chatId }, { token }, { upsert: true });
    bot.sendMessage(chatId, 'Token successfully added');
})

bot.onText(/\/check/, async (msg) => {
    const chatId = msg.chat.id;
    const user = await User.findOne({ chatId })
    bot.sendMessage(chatId, user ? user.token : 'There is no saved token for you. Write /login to add it');
})

bot.on('photo', async (msg) => {
    const chatId = msg.chat.id;
    const instance = await User.findOne({ chatId: chatId });
    if (instance) {
        const fileId = msg.photo[msg.photo.length - 1].file_id;
        const { data: photoBytes } = await getFileBytes(fileId, config.tgToken);
        const { data: inputBytes } = await uploadBytes(photoBytes, instance.token);
        const result = await createMedia(inputBytes, instance.token);
        bot.sendMessage(chatId, 'Photo added');
    } else {
        bot.sendMessage(chatId, 'Please update secret token');
    }
})

module.exports = bot;