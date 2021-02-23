import oauth2Client from './authClient'
import UserDao from '../db/user.dao.js'

export default function refreshInterval() {
    const hour = 950 * 60 * 60
    setInterval(async () => {
        console.log('Start refreshing of tokens')
        const users = await UserDao.find();
        for (let i = 0; i < users.length; i++) {
            console.log(`Refresh for ${users[i].chatId}`)
            if (users[i].refreshToken) {
                const res = await oauth2Client.refreshToken(users[i].refreshToken)
                UserDao.update({
                    chatId: users[i].chatId,
                    accessToken: res.tokens.access_token,
                    refreshToken: users[i].refreshToken
                })
            }
        }
        
    }, hour)
    
}


