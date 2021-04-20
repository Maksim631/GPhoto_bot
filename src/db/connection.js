import mongodb from 'mongodb'
import config from '../config.js'

const { MongoClient } = mongodb


let client

async function connectToDb() {
  client = await MongoClient.connect(config.mongodb, {
    useNewUrlParser: true,
  })
}

export async function getConnection() {
  if (client) {
    return client
  } else {
      await connectToDb();
      return client
  }
}

export async function closeConnection() {
    await client.close();
}
