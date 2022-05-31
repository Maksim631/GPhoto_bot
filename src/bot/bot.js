import TelegramBot from 'node-telegram-bot-api'
import config from '../config.js'
import { find, findAll, update } from '../db/db.js'
import oauth2Client from './authClient.js'
import uploadMedia from './media.js'

const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, { polling: true })

export const isBotCreated = bot ? true : false

export async function closeConnection() {
  await bot.closeWebHook()
}

bot.onText(/\/test/, async (msg) => {
  const chatId = msg.chat.id

  try {
    const users = await findAll()
    bot.sendMessage(chatId, `Users length ${users.length}`)
  } catch (e) {
    console.error(bot.sendMessage(chatId, `/ Error accured: ${e}`))
  }
})

bot.onText(/\/revoke/, async (msg) => {
  const chatId = msg.chat.id
  try {
    const user = await find(chatId)
    const res = await oauth2Client.revokeToken(user.accessToken)
    if (res.status === 200) {
      bot.sendMessage(chatId, 'Token has been successfully revoked')
      await update({ chatId, accessToken: null, refreshToken: null })
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
      prompt: 'consent',
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
    await update({
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
    const user = await find(chatId)
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
    const instance = await find(chatId)
    console.log(
      `/photo bot controller on chatId: ${chatId}. Founded user: ${instance}`,
    )
    if (instance?.accessToken) {
      const result = await uploadMedia(
        msg.photo[msg.photo.length - 1].file_id,
        instance.accessToken,
        'photo',
        chatId,
      )
      if (result) {
        bot.sendMessage(chatId, 'Photo added')
      } else {
        bot.sendMessage(
          chatId,
          'Some error accured. Please contact with developer',
        )
      }
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

bot.on('video', async (msg) => {
  const chatId = msg.chat.id
  try {
    const instance = await find(chatId)
    console.log(
      `/video bot controller on chatId: ${chatId}. Founded user: ${instance}`,
    )
    if (instance?.accessToken) {
      const result = await uploadMedia(
        msg.video.file_id,
        instance.accessToken,
        'video',
        chatId,
      )
      if (result) {
        bot.sendMessage(chatId, 'Video added')
      } else {
        bot.sendMessage(
          chatId,
          'Some error accured. Please contact with developer',
        )
      }
    } else {
      console.log(
        `/video bot controller on chatId: ${chatId}. No secret token was founded`,
      )
      bot.sendMessage(chatId, 'Please update secret token')
    }
  } catch (e) {
    console.error(
      `/video bot controller on chatId: ${chatId}. Error accured: ${e}`,
    )
    bot.sendMessage(chatId, 'Some error accured. Please contact with developer')
  }
})
