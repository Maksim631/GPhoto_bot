import TelegramBot from 'node-telegram-bot-api'
import UserDao from '../db/user.dao.js'
import config from '../config.js'
import { google } from 'googleapis'
import { getFileBytes, uploadBytes, createMedia } from './photo.js'

const oauth2Client = new google.auth.OAuth2(
  config.oAuthClientID,
  config.oAuthclientSecret,
  config.oAuthCallbackUrl,
)
const bot = new TelegramBot(config.tgToken, { polling: true })
const isBotCreated = bot ? true : false
export default isBotCreated;

bot.onText(/\/login/, (msg, match) => {
  const chatId = msg.chat.id
  try {
    const url = oauth2Client.generateAuthUrl({
      scope: config.scopes,
    })
    console.log(
      `/login bot controller on chatId: ${chatId}. Returned value ${url}`,
    )
    bot.sendMessage(chatId, url)
  } catch (e) {
    console.error(
      `/login bot controller on chatId: ${chatId}. Error accured ${e}`,
    )
    bot.sendMessage(chatId, 'Some error accured. Please contact with developer')
  }
})

bot.onText(/\/secret (.+)/, async (msg, match) => {
  const chatId = msg.chat.id
  const secret = match[1]
  try {
    const token = (await oauth2Client.getToken(secret)).tokens.access_token
    await UserDao.update({ chatId, token })
    console.log(
      `/secret bot controller on chatId: ${chatId} and secret value ${secret}. Token was added`,
    )
    bot.sendMessage(chatId, 'Token successfully added')
  } catch (e) {
    console.error(
      `/secret bot controller on chatId: ${chatId} and secret value ${secret}. Error accured: ${e}`,
    )
    bot.sendMessage(chatId, 'Some error accured. Please contact with developer')
  }
})

bot.onText(/\/check/, async (msg) => {
  const chatId = msg.chat.id
  try {
    const user = await UserDao.find(chatId)
    console.log(
      `/check bot controller on chatId: ${chatId}. Founded user: ${user}`,
    )
    bot.sendMessage(
      chatId,
      user
        ? user.token
        : 'There is no saved token for you. Write /login to add it',
    )
  } catch (e) {
    console.error(
      `/check bot controller on chatId: ${chatId}. Error accured: ${e}`,
    )
    bot.sendMessage(chatId, 'Some error accured. Please contact with developer')
  }
})

bot.on('photo', async (msg) => {
  const chatId = msg.chat.id
  try {
    const instance = await UserDao.find(chatId)
    console.log(
      `/photo bot controller on chatId: ${chatId}. Founded user: ${instance}`,
    )
    if (instance) {
      const fileId = msg.photo[msg.photo.length - 1].file_id
      const { data: photoBytes } = await getFileBytes(fileId, config.tgToken)
      const { data: inputBytes } = await uploadBytes(photoBytes, instance.token)
      const result = await createMedia(inputBytes, instance.token)
      console.log(
        `/photo bot controller on chatId: ${chatId}. Create media result: ${result}`,
      )
      bot.sendMessage(chatId, 'Photo added')
    } else {
      console.log(
        `/photo bot controller on chatId: ${chatId}. No secret token was founded`,
      )
      bot.sendMessage(chatId, 'Please update secret token')
    }
  } catch (e) {
    console.error(
      `/photo bot controller on chatId: ${chatId}. Error accured: ${e}`,
    )
    bot.sendMessage(chatId, 'Some error accured. Please contact with developer')
  }
})
