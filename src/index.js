import {
  isBotCreated,
  closeConnection as botCloseConnection,
} from './bot/bot.js'
import refreshInterval from './bot/refresh.js'
import config from './config.js'
import { disconnect as dbDisconnect } from './db/db.js'
import { server } from './server.js'

refreshInterval()

if (isBotCreated) {
  console.log('Bot successfully connected')
} else {
  console.log("Bot couldn't connect")
}

server.listen(config.port, 'localhost', () => {
  console.log(`App successfully listening on port ${config.port}`)
})

try {
  process.on('SIGINT', async () => {
    await botCloseConnection()
    await dbDisconnect()
    server.close()
    process.exit(0)
  })
} catch (e) {
  console.error(`Error accured during connecting to Database. ${e}`)
  process.exit(1)
}
