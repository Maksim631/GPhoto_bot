import {
  isBotCreated,
  closeConnection as botCloseConnection,
} from './bot/bot.js'
import refreshInterval from './bot/refresh.js'
import config from './config.js'
import {
  getConnection,
  closeConnection as dbCloseConnection,
} from './db/connection.js'
import UserDao from './db/user.dao.js'
import app from './server.js'

refreshInterval()

if (isBotCreated) {
  console.log('Bot successfully connected')
} else {
  console.log("Bot couldn't connect")
}

async function initialize() {
  const client = await getConnection()
  await UserDao.injectDB(client)
  return app.listen(config.port, () => {
    console.log(`App successfully listening on port ${config.port}`)
  })
}

try {
  const server = await initialize()
  process.on('SIGINT', async () => {
    console.log('Stopping application1')
    await botCloseConnection()
    await dbCloseConnection()
    server.close()
    process.exit(0)
  })
} catch (e) {
  console.error(`Error accured during connecting to Database. ${e}`)
  process.exit(1)
}

// process.on('exit', () => {
//   console.log('Stopping application')
//   closeConnection()
// })

// process.on('SIGTERM', () => console.log('Stopping application2'))
