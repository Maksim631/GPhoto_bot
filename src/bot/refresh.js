import oauth2Client from './authClient'
import UserDao from '../db/user.dao.js'

export default function refreshInterval() {
    const hour = 950 * 60 * 60
    setInterval(async () => {
        console.log('Start refreshing of tokens')
        const users = await UserDao.find();
        users.forEach(user => {
            console.log(`Refresh for ${user.chatId}`)
            if (user.refreshToken) {
                const res = await oauth2Client.refreshToken(user.refreshToken)
                UserDao.update({
                    chatId: user.chatId,
                    accessToken: res.tokens.access_token,
                    refreshToken: user.refreshToken
                })
            }
        })
    }, hour)
    
}


