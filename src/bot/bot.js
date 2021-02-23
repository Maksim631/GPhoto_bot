import TelegramBot from 'node-telegram-bot-api'
import config from '../config.js'
import UserDao from '../db/user.dao.js'
import oauth2Client from './authClient.js'
import { createMedia, getFileBytes, uploadBytes } from './photo.js'

const bot = new TelegramBot(config.tgToken, { polling: true })
const isBotCreated = bot ? true : false
export default isBotCreated

bot.onText(/\/revoke/, async (msg) => {
  const chatId = msg.chat.id
  try {
    const user = await UserDao.find(chatId)
    const res = await oauth2Client.revokeToken(user.accessToken)
    if (res.status === 200) {
      bot.sendMessage(chatId, 'Token has been successfully revoked')
      await UserDao.update({ chatId, accessToken: null, refreshToken: null })
    } else {
      console.error(`Error accured on /revoke method for chatId ${chatId}`, res)
      bot.sendMessage(
        chatId,
        'Some error accured. Please contact with developer',
      )
    }
  } catch (e) {
    console.error(
      `/check bot controller on chatId: ${chatId}. Error accured: ${e}`,
    )
  }
})

bot.onText(/\/login/, (msg, match) => {
  const chatId = msg.chat.id
  try {
    const url = oauth2Client.generateAuthUrl({
      scope: config.scopes,
      access_type: 'offline',
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
    const { access_token, refresh_token } = (
      await oauth2Client.getToken(secret)
    ).tokens
    await UserDao.update({
      chatId,
      accessToken: access_token,
      refreshToken: refresh_token,
    })
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
      `/check bot controller on chatId: ${chatId}. Founded user:`,
      user,
    )
    bot.sendMessage(
      chatId,
      user
        ? `${user.refreshToken} and ${user.accessToken}`
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
    if (instance?.accessToken) {
      const fileId = msg.photo[msg.photo.length - 1].file_id
      const { data: photoBytes } = await getFileBytes(fileId, config.tgToken)
      const { data: inputBytes } = await uploadBytes(
        photoBytes,
        instance.accessToken,
      )
      const result = await createMedia(inputBytes, instance.accessToken)
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
