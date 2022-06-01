import oauth2Client from './authClient.js'
import { findAll, update } from '../db/db.js'

export default function refreshInterval() {
  const hour = 900 * 60 * 60
  setInterval(async () => {
    console.log('Start refreshing of tokens')
    const users = await findAll()
    for (let i = 0; i < users.length; i++) {
      console.log(`Refresh for ${users[i].chatId}`)
      if (users[i].refreshToken) {
        const res = await oauth2Client.refreshToken(users[i].refreshToken)
        update({
          chatId: users[i].chatId,
          accessToken: res.tokens.access_token,
          refreshToken: users[i].refreshToken,
        })
      }
    }
  }, hour)
}
