import TelegramBot from 'node-telegram-bot-api'
import User from '../db/user.dao.js'
import config from '../config.js'
import { google } from 'googleapis'
import { getFileBytes, uploadBytes, createMedia } from './photo.js'

export default class Bot {
  constructor(logger) {
    this.logger = logger
    this.initializeBot()
  }

  initializeBot() {
    this.oauth2Client = new google.auth.OAuth2(
      config.oAuthClientID,
      config.oAuthclientSecret,
      config.oAuthCallbackUrl,
    )
    this.bot = new TelegramBot(config.tgToken, { polling: true })

    this.bot.onText(/\/login/, (msg, match) => {
      const chatId = msg.chat.id
      try {
        const url = this.oauth2Client.generateAuthUrl({
          scope: config.scopes,
        })
        this.logger.info(
          `/login bot controller on chatId: ${chatId}. Returned value ${url}`,
        )
        this.bot.sendMessage(chatId, url)
      } catch (e) {
        this.logger.error(
          `/login bot controller on chatId: ${chatId}. Error accured ${e}`,
        )
        this.bot.sendMessage(
          chatId,
          'Some error accured. Please contact with developer',
        )
      }
    })

    this.bot.onText(/\/secret (.+)/, async (msg, match) => {
      const chatId = msg.chat.id
      const secret = match[1]
      try {
        const token = (await this.oauth2Client.getToken(secret)).tokens
          .access_token
        await User.findOneAndUpdate({ chatId }, { token }, { upsert: true })
        this.logger.info(
          `/secret bot controller on chatId: ${chatId} and secret value ${secret}. Token was added`,
        )
        this.bot.sendMessage(chatId, 'Token successfully added')
      } catch (e) {
        this.logger.error(
          `/secret bot controller on chatId: ${chatId} and secret value ${secret}. Error accured: ${e}`,
        )
        this.bot.sendMessage(
          chatId,
          'Some error accured. Please contact with developer',
        )
      }
    })

    this.bot.onText(/\/check/, async (msg) => {
      const chatId = msg.chat.id
      try {
        const user = await User.findOne({ chatId })
        this.logger.info(
          `/check bot controller on chatId: ${chatId}. Founded user: ${user}`,
        )
        this.bot.sendMessage(
          chatId,
          user
            ? user.token
            : 'There is no saved token for you. Write /login to add it',
        )
      } catch (e) {
        this.logger.error(
          `/check bot controller on chatId: ${chatId}. Error accured: ${e}`,
        )
        this.bot.sendMessage(
          chatId,
          'Some error accured. Please contact with developer',
        )
      }
    })

    this.bot.on('photo', async (msg) => {
      const chatId = msg.chat.id
      try {
        const instance = await User.findOne({ chatId: chatId })
        this.logger.info(
          `/photo bot controller on chatId: ${chatId}. Founded user: ${instance}`,
        )
        if (instance) {
          const fileId = msg.photo[msg.photo.length - 1].file_id
          const { data: photoBytes } = await getFileBytes(
            fileId,
            config.tgToken,
          )
          const { data: inputBytes } = await uploadBytes(
            photoBytes,
            instance.token,
          )
          const result = await createMedia(inputBytes, instance.token)
          this.logger.info(
            `/photo bot controller on chatId: ${chatId}. Create media result: ${result}`,
          )
          this.bot.sendMessage(chatId, 'Photo added')
        } else {
          this.logger.info(
            `/photo bot controller on chatId: ${chatId}. No secret token was founded`,
          )
          this.bot.sendMessage(chatId, 'Please update secret token')
        }
      } catch (e) {
        this.logger.error(
          `/photo bot controller on chatId: ${chatId}. Error accured: ${e}`,
        )
        this.bot.sendMessage(
          chatId,
          'Some error accured. Please contact with developer',
        )
      }
    })
  }
}
